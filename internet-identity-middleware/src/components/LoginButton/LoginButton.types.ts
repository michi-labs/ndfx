export type OnSuccessHandler = () => void;
export type OnErrorHandler = (error: any) => void;
export type LoginActionHandlers = {
  onSuccess?: OnSuccessHandler;
  onError?: OnErrorHandler;
};
