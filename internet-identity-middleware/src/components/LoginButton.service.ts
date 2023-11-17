import { AuthClient } from "@dfinity/auth-client";
import { SignIdentity, Signature } from "@dfinity/agent";
import {
  DelegationChain,
  DelegationIdentity,
  Ed25519PublicKey,
} from "@dfinity/identity";

import { LoginActionHandlers, StrategyTypes } from "./LoginButton.types";
import { IDENTITY_PROVIDER } from "./LoginButton.constants";
import { fromHexString } from "./LoginButton.helpers";

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

  try {
    authClient.login({
      identityProvider: IDENTITY_PROVIDER,
      onSuccess: async () => {
        const identity = authClient.getIdentity();

        actions.onSuccess?.();

        if (identity instanceof DelegationIdentity) {
          const delegationIdentity = identity.getDelegation();
          notifySuccess(delegationIdentity, "window");
          // TODO: Log out after send event?
        }
      },
    });
  } catch (error) {
    console.log({ error });
  }
};

export function notifySuccess(
  delegation: DelegationChain,
  strategy: StrategyTypes
) {
  const message = {
    kind: "authorize-client-success",
    delegations: delegation.delegations,
    userPublicKey: delegation.publicKey,
  };

  switch (strategy) {
    case "window":
      window.opener?.postMessage(message, "*");
      break;
    default:
      console.log("Strategy not implemented");
  }
}
