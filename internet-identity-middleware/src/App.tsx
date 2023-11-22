import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import LoginButton from "./components/LoginButton.component";
import { Auth } from "./services/auth/auth.service";

function App() {
  const [isAuth, setAuth] = useState(false);

  // middleware?sessionKey={hexa}&appLink=com.app.algo
  // myapp://sesion-success
  // https://www.goog.com/ <- No
  // Session Key must come from sessionKey param
  const key = Ed25519KeyIdentity.generate();
  const publicKey = key.getPublicKey();
  const sessionKey = Auth.toHexString(publicKey.toDer());

  const onSuccessAuth = () => {
    setAuth(true);
  };

  // TODO: Validate data and implement view for errors
  // TODO: Multilanguage

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
              <LoginButton sessionKey={sessionKey} onSuccess={onSuccessAuth}>
                Ingresar con II
              </LoginButton>
            </p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
