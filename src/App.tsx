import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { AuthClient } from "./icp/middleware/auth-middleware";

function App() {
  const [isAuth, setAuth] = useState(false);
  let client: AuthClient;

  useEffect(() => {
    init();
  });

  async function init() {
    client = await AuthClient.create();
  }

  function login() {
    client.login({
      onSuccess: () => setAuth(true),
    });
  }

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
              <button onClick={() => login()}>Ingresar</button>
            </p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
