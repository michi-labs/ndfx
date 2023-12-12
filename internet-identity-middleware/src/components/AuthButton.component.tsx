import { useAuth } from "../hooks/useAuth";

const AuthButton = () => {
  const { isAuth, login, navigate } = useAuth();

  return !isAuth ? (
    <button onClick={() => login()}>Ingresar</button>
  ) : (
    <button onClick={() => navigate()}>Regresar</button>
  );
};

export default AuthButton;
