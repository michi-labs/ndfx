import { useState } from "react";

import LoginButton from "../LoginButton/LoginButton.component";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { Auth } from "../../services/auth/auth.service";

function Login() {
  const [isAuth, setAuth] = useState(false);
  const onSuccessAuth = () => {
    setAuth(true);
  };

  // middleware?sessionKey={hexa}&appLink=com.app.algo
  // myapp://sesion-success
  // https://www.goog.com/ <- No
  // Session Key must come from sessionKey param
  const key = Ed25519KeyIdentity.generate();
  const publicKey = key.getPublicKey();
  const sessionKey = Auth.toHexString(publicKey.toDer());

  return (
    <main>
      {/* <img src={logo} className="" alt="logo" /> */}
      <div className="container">
        {isAuth ? (
          <div>
            <p>Se ha autenticado correctamente</p>
            <p>Puede cerrar esta ventana</p>
          </div>
        ) : (
          <div>
            <p>Necesitas ingresar con tu identidad de Internet Identity</p>
            <p>
              <LoginButton sessionKey={sessionKey} onSuccess={onSuccessAuth}>
                Ingresar con II
              </LoginButton>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Login;
