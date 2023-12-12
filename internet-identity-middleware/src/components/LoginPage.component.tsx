import AuthButton from "./AuthButton.component";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const { isAuth } = useAuth();

  // TODO: Implement errors view
  return (
    <main>
      <div className="container">
        {!isAuth ? (
          <div>
            <p>Necesitas ingresar con tu identidad de Internet Identity</p>
            <p></p>
          </div>
        ) : (
          <div>
            <p>Se ha autenticado correctamente</p>
            <p>Da en continuar para ir a la aplicación</p>
          </div>
        )}
        <AuthButton />
      </div>
    </main>
  );
}

export default LoginPage;
