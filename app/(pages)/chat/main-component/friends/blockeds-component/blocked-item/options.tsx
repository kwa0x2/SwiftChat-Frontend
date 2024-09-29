import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Remove } from "@/app/api/services/friendship.Service";
import { CgUnblock } from "react-icons/cg";
import { toast } from "sonner";
import { BlockedModel } from "@/app/(pages)/chat/main-component/friends/blockeds-component/blocked";
import io, { Socket } from "socket.io-client";
import { updateChatListDeletedAtByEmail } from "@/app/redux/slices/chatlistSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { updateMessageBoxDeletedAtByEmail } from "@/app/redux/slices/messageBoxSlice";

interface BlockedsProps {
  blockedUser: BlockedModel;
  socket: Socket | null;
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
}

const Options: React.FC<BlockedsProps> = ({ blockedUser,socket,setBlockedUsers }) => {
  const dispatch = useDispatch<AppDispatch>();

  const unBlock = async (blocked: BlockedModel) => {
    // const res = await Remove(friendMail);
    // if (res.status === 200) {
    //   toast.success("The block has been successfully removed.");
    // } else {
    //   toast.error("An unknown error occurred while trying to unblock the user. Please try again later.");
    // }
    if (socket) {
      let user_mail= blocked.blocked_mail
      let user_name= blocked.user_name


      socket.emit(
        "deleteFriend",
        {
          user_mail,
          user_name,
        },
        (response: any) => {
          console.warn(response);
          if (response.status === "error") {
            toast.error(
              "An unknown error occurred while trying to remove the friend."
            );
          } else if (response.status === "success") {
            dispatch(updateChatListDeletedAtByEmail({
              user_email: user_mail,
              deletedAt: null
            }))
            dispatch(updateMessageBoxDeletedAtByEmail({
              user_email: user_mail,
              deletedAt: new Date().toISOString()
            }))
            setBlockedUsers((prevRequests) => prevRequests.filter(req => req.blocked_mail !== user_mail));
            toast.success(`${user_name} has been deleted from friends!`);

          }
        }
      );
    }
  };
  

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <CgUnblock
              onClick={() => unBlock(blockedUser)}
              className="text-[#3b82f6] h-5 w-5 transition-all duration-500   opacity-70 hover:opacity-100"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Unblock</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default Options;
