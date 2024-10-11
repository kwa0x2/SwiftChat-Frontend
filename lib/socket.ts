import { toast } from "sonner";

//#region Socket Emit Handler
export const handleSocketEmit = (
  socket: any,
  event: string,
  data: any,
  successMessage?: string,
  onSuccess?: (response: any) => void,
  onError?: () => void
) => {
  if (socket) {
    socket.emit(event, data, (response: any) => {
      if (response.status === "error") {
        if (onError) onError();
      } else if (response.status === "success") {
        if (successMessage) toast.success(successMessage);

        if (onSuccess) onSuccess(response.message);
      }
    });
  }
};
//#endregion
