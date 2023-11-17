import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { login } from "./icp/middleware/middleware";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { toHexString } from "./icp/middleware/middleware.helpers";

function App() {
  const [isAuth, setAuth] = useState(false);

  // Session Key must come from sessionKeyParam
  const key = Ed25519KeyIdentity.generate();
  const publicKey = key.getPublicKey();
  const sessionKey = toHexString(publicKey.toDer());

  const onSuccessAuth = () => {
    setAuth(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isAuth ? (
          <div>
            <p>Se ha autenticado correctamente</p>
            <p>Puede cerrar esta ventana</p>
          </div>
        ) : (
          <div>
            <p>Necesitas ingresar con tu identidad de Internet Identity</p>
            <p>
              <button
                onClick={() => login(sessionKey, { onSuccess: onSuccessAuth })}
              >
                Ingresar
              </button>
            </p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
