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

interface BlockedsProps {
  blocked: BlockedModel;
}



const Options: React.FC<BlockedsProps> = ({ blocked }) => {

  const unBlock = async (friendMail: string) => {
    const res = await Remove(friendMail);
    if (res.status === 200) {
      toast.success("The block has been successfully removed.");
    } else {
      toast.error("An unknown error occurred while trying to unblock the user. Please try again later.");
    }
  };
  

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <CgUnblock
              onClick={() => unBlock(blocked.blocked_mail)}
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
