import { Principal } from "@dfinity/principal";

export type OnSuccessCallback = (() => void) | (() => Promise<void>);

export type OnErrorCallback =
  | ((error?: string) => void)
  | ((error?: string) => Promise<void>);

export interface GetEventHandlerOptions {
  /**
   * Identity provider
   * @default "https://identity.ic0.app"
   */
  identityProviderUrl: URL;
  /**
   * Expiration of the authentication in nanoseconds
   * @default  BigInt(8) hours * BigInt(3_600_000_000_000) nanoseconds
   */
  maxTimeToLive: bigint;
  /**
   * Origin for Identity Provider to use while generating the delegated identity. For II, the derivation origin must authorize this origin by setting a record at `<derivation-origin>/.well-known/ii-alternative-origins`.
   * @see https://github.com/dfinity/internet-identity/blob/main/docs/internet-identity-spec.adoc
   */
  derivationOrigin?: string | URL;
  /**
   * Auth Window feature config string
   * @example "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100"
   */
  // windowOpenerFeatures?: string;
}

export interface GetEventHandlerActions {
  /**
   * Callback once login has completed
   */
  onSuccess?: OnSuccessCallback;
  /**
   * Callback in case authentication fails
   */
  onError?: OnErrorCallback;
}

export interface AuthClientLoginOptions {
  /**
   * Identity provider
   * @default "https://identity.ic0.app"
   */
  identityProvider?: string | URL;
  /**
   * Expiration of the authentication in nanoseconds
   * @default  BigInt(8) hours * BigInt(3_600_000_000_000) nanoseconds
   */
  maxTimeToLive?: bigint;
  /**
   * Origin for Identity Provider to use while generating the delegated identity. For II, the derivation origin must authorize this origin by setting a record at `<derivation-origin>/.well-known/ii-alternative-origins`.
   * @see https://github.com/dfinity/internet-identity/blob/main/docs/internet-identity-spec.adoc
   */
  derivationOrigin?: string | URL;
  /**
   * Auth Window feature config string
   * @example "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100"
   */
  windowOpenerFeatures?: string;
  /**
   * Callback once login has completed
   */
  onSuccess?: OnSuccessCallback;
  /**
   * Callback in case authentication fails
   */
  onError?: OnErrorCallback;
}

export interface InternetIdentityAuthRequest {
  kind: "authorize-client";
  sessionPublicKey: Uint8Array;
  maxTimeToLive?: bigint;
  derivationOrigin?: string;
}

export interface Delegation {
  pubkey: Uint8Array;
  expiration: bigint;
  targets?: Principal[];
}

export type Delegations = Delegation[];

export interface HandleSuccessMessage {
  delegations: Delegations;
  userPublicKey: Uint8Array;
}

export interface AuthReadyMessage {
  kind: "authorize-ready";
}

export interface AuthResponseSuccess {
  kind: "authorize-client-success";
  delegations: Delegations;
  userPublicKey: Uint8Array;
}

export interface AuthResponseFailure {
  kind: "authorize-client-failure";
  text: string;
}

export type IdentityServiceResponseMessage = AuthReadyMessage | AuthResponse;
export type AuthResponse = AuthResponseSuccess | AuthResponseFailure;
