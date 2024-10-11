import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CgUnblock } from "react-icons/cg";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { Remove } from "@/app/api/services/friend.Service";
import { handleFriendStatusUpdate } from "@/lib/slice";
import { BlockedModel } from "@/models/Blocked";

interface BlockedsProps {
  blockedUser: BlockedModel;
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
}

const Options: React.FC<BlockedsProps> = ({ blockedUser, setBlockedUsers }) => {
  const dispatch = useDispatch<AppDispatch>();

  //#region Unblock Functionality
  // Function to unblock a user
  const unBlock = async () => {
    const res = await Remove(blockedUser.blocked_email); // Call the remove service to unblock
    if (res.status === 200) {
      // If the unblock is successful
      setBlockedUsers((prevRequests) =>
        prevRequests.filter(
          (req) => req.blocked_email !== blockedUser.blocked_email // Remove the unblocked user from the state
        )
      );
      handleFriendStatusUpdate(dispatch, blockedUser.blocked_email, "unfriend"); // Update friend status in Redux

      toast.success(
        `${blockedUser.user_name} has been successfully unblocked!` // Show success message
      );
    } else {
      toast.error(
        "An unknown error occurred while trying to remove the friend." // Show error message if the unblock fails
      );
    }
  };
  //#endregion

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
