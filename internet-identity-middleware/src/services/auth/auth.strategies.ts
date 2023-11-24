import { DelegationChain } from "@dfinity/identity";
import {
  AuthErrorMessage,
  AuthSuccessMessage,
  NotifyStrategy,
} from "./auth.service.types";

export class WindowNotify implements NotifyStrategy {
  public success(delegation: DelegationChain) {
    const message: AuthSuccessMessage = {
      kind: "authorize-client-success",
      delegations: delegation.delegations,
      userPublicKey: delegation.publicKey,
    };

    window.opener?.postMessage(message, "*");
  }

  public error(error: any) {
    const message: AuthErrorMessage = {
      kind: "authorize-client-error",
      error,
    };

    window.opener?.postMessage(message, "*");
  }
}

export class ApplinkNotify implements NotifyStrategy {
  constructor(private appLink: string) {}

  public success(delegation: DelegationChain) {
    const message: AuthSuccessMessage = {
      kind: "authorize-client-success",
      delegations: delegation.delegations,
      userPublicKey: delegation.publicKey,
    };

    const stringMessage = JSON.stringify(message);

    window.open(`${this.appLink}authorize-client-success?key=${stringMessage}`);
  }

  public error(error: any) {
    const message: AuthErrorMessage = {
      kind: "authorize-client-error",
      error,
    };

    const stringMessage = JSON.stringify(message);

    window.open(`${this.appLink}authorize-client-error?error=${stringMessage}`);
  }
}
