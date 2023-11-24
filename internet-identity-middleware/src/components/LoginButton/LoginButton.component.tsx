import { Auth } from "../../services/auth/auth.service";
import {
  ApplinkNotify,
  WindowNotify,
} from "../../services/auth/auth.strategies";

interface LoginButtonProps {
  children: any;
  strategy: string;
  applink?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const LoginButton = (props: LoginButtonProps) => {
  const { children, strategy, applink, onSuccess, onError } = props;

  let notify;

  switch (strategy) {
    case "window":
      notify = new WindowNotify();
      break;
    case "applink":
      if (applink) {
        notify = new ApplinkNotify(applink);
      } else {
        throw new Error(
          "Se requiere la propiedad 'applink' para la estrategia 'applink'"
        );
      }
      break;
    default:
      throw new Error(`Estrategia de comunicación no reconocida: ${strategy}`);
  }

  const authService = new Auth(notify);

  return (
    <button onClick={() => authService.login({ onSuccess, onError })}>
      {children}
    </button>
  );
};

export default LoginButton;
