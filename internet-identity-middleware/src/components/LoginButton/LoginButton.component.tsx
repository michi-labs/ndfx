import { Auth } from "../../services/auth/auth.service";
import { WindowNotify } from "../../services/auth/auth.strategies";

interface LoginButtonProps {
  children: any;
  sessionKey: string;
  onSuccess?: () => void;
  onError?: () => void;
}

const LoginButton = (props: LoginButtonProps) => {
  const { sessionKey, onSuccess, children } = props;

  const notify = new WindowNotify();
  const authService = new Auth(sessionKey, notify);

  return (
    <button onClick={() => authService.login({ onSuccess })}>{children}</button>
  );
};

export default LoginButton;
