import { DerEncodedPublicKey } from "@dfinity/agent";
import { DelegationChain, SignedDelegation } from "@dfinity/identity";

export type AuthSuccessMessage = {
  kind: "authorize-client-success";
  delegations: SignedDelegation[];
  userPublicKey: DerEncodedPublicKey;
};

export type AuthErrorMessage = {
  kind: "authorize-client-error";
  error: any;
};

export interface NotifyStrategy {
  success: (delegation: DelegationChain) => void;
  error: (error: any) => void;
}
