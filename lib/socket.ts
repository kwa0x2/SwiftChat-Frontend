import { toast } from "sonner";

export const handleSocketEmit = (
  socket: any,
  event: string,
  data: any,
  successMessage: string | null,
  onSuccess: (response: any) => void,
  onError: () => void
) => {

  if (socket) {

    socket.emit(event, data, (response: any) => {
      if (response.status === "error") {
        onError();
      } else if (response.status === "success") {
        if (successMessage) {
          toast.success(successMessage); 
        }
        onSuccess(response.message);
      }
    });
  }
};
