import {
  DelegationIdentity,
  Ed25519KeyIdentity,
  Ed25519PublicKey,
} from "@dfinity/identity";
import { AuthClient } from "@dfinity/auth-client";

import { LoginActionHandlers } from "../../components/LoginButton/LoginButton.types";
import { IncompleteEd25519KeyIdentity } from "../key-identity";
import { NotifyStrategy } from "./auth.service.types";

const INTERNET_IDENTITY_PROVIDER_DEFAULT_URL = "https://identity.ic0.app";
const INTERNET_IDENTITY_PROVIDER_URL =
  process.env.REACT_APP_INTERNET_IDENTITY_PROVIDER_URL;
export const IDENTITY_PROVIDER =
  INTERNET_IDENTITY_PROVIDER_URL || INTERNET_IDENTITY_PROVIDER_DEFAULT_URL;

export class Auth {
  private sessionKey: string;

  constructor(private notify: NotifyStrategy) {
    this.sessionKey = this.generateSessionKey();
  }

  public static toHexString(buffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(buffer);
    return Array.prototype.map
      .call(uint8Array, (byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  public static fromHexString(hexString: string): ArrayBufferLike {
    return new Uint8Array(
      (hexString.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16))
    ).buffer;
  }

  public generateSessionKey(): string {
    const key = Ed25519KeyIdentity.generate();
    const publicKey = key.getPublicKey();
    const sessionKey = Auth.toHexString(publicKey.toDer());
    return sessionKey;
  }

  public login = async (actions: LoginActionHandlers) => {
    const publicKey = Ed25519PublicKey.fromDer(
      Auth.fromHexString(this.sessionKey)
    );
    const myKeyIdentity = new IncompleteEd25519KeyIdentity(publicKey);

    const authClient = await AuthClient.create({
      identity: myKeyIdentity,
    });

    try {
      authClient.login({
        identityProvider: IDENTITY_PROVIDER,
        onSuccess: async () => {
          const identity = authClient.getIdentity();

          actions.onSuccess?.();

          if (identity instanceof DelegationIdentity) {
            const delegationIdentity = identity.getDelegation();
            this.notify.success(delegationIdentity);
            // TODO: Log out after send event?
          }
        },
      });
    } catch (error) {
      actions.onError?.(error);
      this.notify.error(error);
    }
  };
}
