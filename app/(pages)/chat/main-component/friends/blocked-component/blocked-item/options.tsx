import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CgUnblock } from "react-icons/cg";
import { toast } from "sonner";
import { BlockedModel } from "@/app/(pages)/chat/main-component/friends/blocked-component/blocked";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { updateChatFriendStatusByEmail } from "@/app/redux/slices/chatSlice";
import { updateChatListFriendStatusByEmail } from "@/app/redux/slices/chatListSlice";
import { Remove } from "@/app/api/services/friendship.Service";

interface BlockedsProps {
  blockedUser: BlockedModel;
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
}

const Options: React.FC<BlockedsProps> = ({
  blockedUser,
  setBlockedUsers,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const unBlock = async () => {
    const res = await Remove(blockedUser.blocked_mail);
    if (res.status === 200) {
      dispatch(
        updateChatListFriendStatusByEmail({
          user_email: blockedUser.blocked_mail,
          friend_status: "unfriend",
        })
      );
      dispatch(
        updateChatFriendStatusByEmail({
          user_email: blockedUser.blocked_mail,
          friend_status: "unfriend",
        })
      );
      setBlockedUsers((prevRequests) =>
        prevRequests.filter(
          (req) => req.blocked_mail !== blockedUser.blocked_mail
        )
      );
      toast.success(`${blockedUser.user_name} has been successfully unblocked!`)
    } else {
      toast.error(
        "An unknown error occurred while trying to remove the friend."
      );
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <CgUnblock
              onClick={unBlock}
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
