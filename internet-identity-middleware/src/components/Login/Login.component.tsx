import { useState } from "react";

import LoginButton from "../LoginButton/LoginButton.component";
import { PageParamsError } from "./Login.errors";

type AuthQueryParams = {
  strategy: string | null;
  applink: string | null;
};

type LoginOptions = {
  strategy: string;
  applink?: string;
};

function getLoginOptions(): LoginOptions {
  const searchParams = new URLSearchParams(document.location.search);
  const queryParams: AuthQueryParams = {
    strategy: searchParams.get("strategy"),
    applink: searchParams.get("applink"),
  };

  const paramsAreValid = validateLoginPageQueryParams(queryParams);

  if (paramsAreValid) {
    const options = {
      strategy: queryParams.strategy!,
      applink: queryParams.applink || undefined,
    };

    return options;
  }

  throw new PageParamsError("Missing data");
}

function validateLoginPageQueryParams(params: AuthQueryParams): boolean {
  if (!params.strategy) {
    return false;
  }

  if (params.strategy === "applink" && !params.applink) {
    return false;
  }

  return true;
}

function Login() {
  const options = getLoginOptions();

  const [isAuth, setAuth] = useState(false);

  const onAuthSuccess = () => {
    setAuth(true);
  };

  const onAuthError = (error: any) => {
    console.log(error);
  };

  // TODO: Implement errors view
  return (
    <main>
      <div className="container">
        {!isAuth ? (
          <div>
            <p>Necesitas ingresar con tu identidad de Internet Identity</p>
            <p>
              <LoginButton
                strategy={options.strategy}
                applink={options.applink}
                onSuccess={onAuthSuccess}
                onError={onAuthError}
              >
                Ingresar con II
              </LoginButton>
            </p>
          </div>
        ) : (
          <div>
            <p>Se ha autenticado correctamente</p>
            <p>Puede cerrar esta ventana</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Login;
