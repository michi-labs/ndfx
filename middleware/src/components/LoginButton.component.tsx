import { login } from "./LoginButton.service";

interface LoginButtonProps {
  children: any;
  sessionKey: string;
  onSuccess?: () => void;
  onError?: () => void;
}

const LoginButton = (props: LoginButtonProps) => {
  const { sessionKey, onSuccess, children } = props;
  return (
    <button onClick={() => login(sessionKey, { onSuccess })}>{children}</button>
  );
};

export default LoginButton;
