import { SignIdentity } from "@dfinity/agent";
import { ECDSAKeyIdentity } from "@dfinity/identity";

import {
  IdentityServiceResponseMessage,
  InternetIdentityAuthRequest,
  AuthClientLoginOptions,
  GetEventHandlerOptions,
  OnErrorCallback,
  GetEventHandlerActions,
  HandleSuccessMessage,
} from "./auth-middleware.types";
import {
  IDENTITY_PROVIDER_DEFAULT,
  IDENTITY_PROVIDER_ENDPOINT,
  INTERRUPT_CHECK_INTERVAL,
  ERROR_USER_INTERRUPT,
} from "./auth-middleware.constants";

/**
 * Tool to manage authentication and identity
 * @see {@link AuthClient}
 */
export class AuthClient {
  private eventHandler?: (event: MessageEvent) => void;

  protected constructor(private _key: SignIdentity) {}

  public static async create() {
    // Get data from shared source between app and middleware
    const key = await ECDSAKeyIdentity.generate(); //This key shoul be generated from client
    return new AuthClient(key);
  }

  /**
   * AuthClient Login
   * Opens up a new window to authenticate with Internet Identity
   * @example
   * const authClient = await AuthClient.create();
   * authClient.login({
   *  identityProvider: 'http://<canisterID>.127.0.0.1:8000',
   *  maxTimeToLive: BigInt (7) * BigInt(24) * BigInt(3_600_000_000_000), // 1 week
   *  windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
   *  onSuccess: () => {
   *    console.log('Login Successful!');
   *  },
   *  onError: (error) => {
   *    console.error('Login Failed: ', error);
   *  }
   * });
   */
  public async login(options?: AuthClientLoginOptions): Promise<void> {
    // Create the URL of the IDP. (e.g. https://XXXX/#authorize)
    const identityProviderUrl = new URL(
      options?.identityProvider?.toString() || IDENTITY_PROVIDER_DEFAULT
    );
    // Set the correct hash if it isn't already set.
    identityProviderUrl.hash = IDENTITY_PROVIDER_ENDPOINT;

    // Open a new window with the IDP provider.
    const idpWindow = window.open(
      identityProviderUrl.toString(),
      "idpWindow",
      options?.windowOpenerFeatures
    );

    const maxTimeToLive =
      options?.maxTimeToLive ||
      // Set default maxTimeToLive to 8 hours
      /* hours */ BigInt(8) * /* nanoseconds */ BigInt(3_600_000_000_000);

    const getEventHandlerOptions: GetEventHandlerOptions = {
      identityProviderUrl,
      maxTimeToLive,
      derivationOrigin: options?.derivationOrigin,
    };

    const getEventHandlerActions: GetEventHandlerActions = {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    };

    // Add an event listener to handle responses.
    this.eventHandler = this.getEventHandler(
      idpWindow,
      getEventHandlerOptions,
      getEventHandlerActions
    );

    window.addEventListener("message", this.eventHandler);

    // Check if the idpWindow is closed by user.
    this.checkInterruption(idpWindow, options?.onError);
  }

  private getEventHandler(
    idpWindow: Window | null,
    options: GetEventHandlerOptions,
    actions: GetEventHandlerActions
  ) {
    const { identityProviderUrl, maxTimeToLive, derivationOrigin } = options;

    return async (event: MessageEvent<IdentityServiceResponseMessage>) => {
      if (event.origin !== identityProviderUrl.origin) {
        console.warn(
          `WARNING: expected origin '${identityProviderUrl.origin}', got '${event.origin}' (ignoring)`
        );
        return;
      }

      const message = event.data;

      switch (message.kind) {
        case "authorize-ready": {
          // IDP is ready. Send a message to request authorization.
          const request: InternetIdentityAuthRequest = {
            kind: "authorize-client",
            sessionPublicKey: new Uint8Array(this._key.getPublicKey().toDer()),
            maxTimeToLive,
            derivationOrigin: derivationOrigin?.toString(),
          };
          idpWindow?.postMessage(request, identityProviderUrl?.origin);
          break;
        }
        case "authorize-client-success":
          try {
            const successMessage: HandleSuccessMessage = {
              delegations: message.delegations,
              userPublicKey: message.userPublicKey,
            };

            this.handleSuccess(idpWindow, successMessage, actions.onSuccess);
          } catch (err) {
            this.handleFailure(
              idpWindow,
              (err as Error).message,
              actions.onError
            );
          }
          break;
        case "authorize-client-failure":
          this.handleFailure(idpWindow, message.text, actions.onError);
          break;
        default:
          break;
      }
    };
  }

  private async handleSuccess(
    idpWindow: Window | null,
    message: HandleSuccessMessage,
    callback?: () => void
  ) {
    // TODO: Send data to client
    console.log({ message });
    idpWindow?.close();
    this.removeEventListener();

    // onSuccess should be the last thing to do to avoid consumers
    // interfering by navigating or refreshing the page
    callback?.();
  }

  private handleFailure(
    idpWindow: Window | null,
    errorMessage?: string,
    onError?: (error?: string) => void
  ): void {
    idpWindow?.close();
    onError?.(errorMessage);
    this.removeEventListener();
  }

  private removeEventListener() {
    if (this.eventHandler) {
      window.removeEventListener("message", this.eventHandler);
    }
    this.eventHandler = undefined;
  }

  private checkInterruption(
    idpWindow: Window | null,
    onError?: OnErrorCallback
  ) {
    // The idpWindow is opened and not yet closed by the client
    if (idpWindow) {
      if (idpWindow.closed) {
        this.handleFailure(idpWindow, ERROR_USER_INTERRUPT, onError);
      } else {
        setTimeout(
          () => this.checkInterruption(idpWindow, onError),
          INTERRUPT_CHECK_INTERVAL
        );
      }
    }
  }
}
