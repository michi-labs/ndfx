import { useContext, useState } from "react";
import { fromHex } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

import { AuthContext } from "../context/auth.context";
import { useParams } from "./useParams";
import { DelegationIdentity, Ed25519PublicKey } from "@dfinity/identity";
import { IncompleteEd25519KeyIdentity } from "../services/incomplete-identity";

const INTERNET_IDENTITY_PROVIDER_DEFAULT_URL = "https://identity.ic0.app";
const INTERNET_IDENTITY_PROVIDER_URL =
  process.env.REACT_APP_INTERNET_IDENTITY_PROVIDER_URL;
export const IDENTITY_PROVIDER =
  INTERNET_IDENTITY_PROVIDER_URL || INTERNET_IDENTITY_PROVIDER_DEFAULT_URL;

export const useAuth = () => {
  const { isAuth, authenticate } = useContext(AuthContext);
  const { pubkey, redirect_uri } = useParams();
  const [delegation, setDelegation] = useState<string | undefined>();

  async function login() {
    const publicKey = Ed25519PublicKey.fromDer(fromHex(pubkey));

    const incompleteIdentity = new IncompleteEd25519KeyIdentity(publicKey);

    try {
      const client = await AuthClient.create({
        identity: incompleteIdentity,
      });

      client.login({
        identityProvider: IDENTITY_PROVIDER,
        onSuccess: async () => {
          const identity = client.getIdentity();

          if (identity instanceof DelegationIdentity) {
            const delegation = identity.getDelegation();
            const delegationString = JSON.stringify(delegation);
            setDelegation(delegationString);

            authenticate();
          }
        },
      });
    } catch (error) {
      throw error;
    }
  }

  function navigate() {
    if (!delegation) throw new Error("delegation not defined");

    window.open(
      `${redirect_uri}authorize-client-success?key=${pubkey}&delegation=${delegation}`
    );
  }

  return {
    isAuth,
    login,
    navigate,
  };
};
