import { AuthClient } from "@dfinity/auth-client";
import { SignIdentity, Signature } from "@dfinity/agent";
import { DelegationIdentity, Ed25519PublicKey } from "@dfinity/identity";

import { fromHexString } from "./LoginButton.helpers";

type OnSuccessHandler = () => void;
type OnErrorHandler = () => void;
type LoginActionHandlers = {
  onSuccess?: OnSuccessHandler;
  onError?: OnErrorHandler;
};

class IncompleteEd25519KeyIdentity extends SignIdentity {
  private _publicKey: Ed25519PublicKey;

  constructor(publicKey: Ed25519PublicKey) {
    super();
    this._publicKey = publicKey;
  }

  // We don't need implement this method
  // @ts-ignore
  public sign(blob: ArrayBuffer): Promise<Signature> {}

  // @ts-ignore
  public getPublicKey() {
    return this._publicKey;
  }
}

export const login = async (
  sessionKey: string,
  actions: LoginActionHandlers
) => {
  const publicKey = Ed25519PublicKey.fromDer(fromHexString(sessionKey));
  const myKeyIdentity = new IncompleteEd25519KeyIdentity(publicKey);

  const authClient = await AuthClient.create({
    identity: myKeyIdentity,
  });

  authClient.login({
    onSuccess: async () => {
      const identity = authClient.getIdentity();
      console.log({ identity });

      actions.onSuccess?.();

      if (identity instanceof DelegationIdentity) {
        const delegationIdentity = identity.getDelegation();
        const message = JSON.stringify(delegationIdentity.toJSON());

        console.log({ message });
        window.ReactNativeWebView?.postMessage(message);
        // TODO: Log out after send event?
      }
    },
  });
};
