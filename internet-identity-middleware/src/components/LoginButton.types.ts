export type OnSuccessHandler = () => void;
export type OnErrorHandler = () => void;
export type LoginActionHandlers = {
  onSuccess?: OnSuccessHandler;
  onError?: OnErrorHandler;
};
