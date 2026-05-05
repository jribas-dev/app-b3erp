import { toast as sonnerToast } from "sonner";

type ToastOptions = Parameters<typeof sonnerToast>[1];

export const toast = {
  sucesso: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, options),
  erro: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, options),
  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, options),
  aviso: (message: string, options?: ToastOptions) =>
    sonnerToast.warning(message, options),
  promessa: sonnerToast.promise,
  customizado: sonnerToast,
  dispensar: sonnerToast.dismiss,
};
