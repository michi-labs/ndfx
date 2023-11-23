import { DelegationIdentity, Ed25519PublicKey } from "@dfinity/identity";
import { AuthClient } from "@dfinity/auth-client";
import { LoginActionHandlers } from "../../components/LoginButton/LoginButton.types";
import { IncompleteEd25519KeyIdentity } from "../key-identity";
import { NotifyStrategy } from "./auth.service.types";

const INTERNET_IDENTITY_PROVIDER_URL =
  process.env.REACT_APP_INTERNET_IDENTITY_PROVIDER_URL;
export const IDENTITY_PROVIDER =
  INTERNET_IDENTITY_PROVIDER_URL || "https://identity.ic0.app";

export class Auth {
  constructor(private sessionKey: string, private notify: NotifyStrategy) {}

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
            console.log("DelegationEntity");
            const delegationIdentity = identity.getDelegation();
            this.notify.success(delegationIdentity);
            // TODO: Log out after send event?
          }
        },
      });
    } catch (error) {
      this.notify.error(error);
      console.log({ error });
    }
  };
}
