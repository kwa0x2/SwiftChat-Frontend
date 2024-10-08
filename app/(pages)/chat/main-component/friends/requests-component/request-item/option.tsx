import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsCheckLg } from "react-icons/bs";
import { LiaTimesSolid } from "react-icons/lia";
import { RequestsModel } from "../requests";
import { RequestStatus } from "@/models/Enum";
import { toast } from "sonner";
import { FriendModel } from "../../friends-component/friends";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { updateChatListFriendStatusByEmail } from "@/app/redux/slices/chatListSlice";
import { updateChatFriendStatusByEmail } from "@/app/redux/slices/chatSlice";
import { UpdateFriendshipRequest } from "@/app/api/services/request.Service";

interface ComingRequestsProps {
  requests: RequestsModel;
  setRequests: React.Dispatch<React.SetStateAction<RequestsModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendModel[]>>;
}

const Options: React.FC<ComingRequestsProps> = ({
  requests,
  setRequests,
  setFriends,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const updateFriendshipRequest = async (
    request: RequestsModel,
    status: RequestStatus
  ) => {
    const res = await UpdateFriendshipRequest(request.sender_mail, status);
    if (res.status === 200) {
      if (status === RequestStatus.accepted) {
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.sender_mail !== request.sender_mail)
        );

        const newFriend: FriendModel = {
          friend_mail: request.sender_mail,
          user_name: requests.user_name,
          user_photo: request.user_photo,
          activeStatus: request.activeStatus,
        };

        setFriends((prevRequests) => {
          if (!Array.isArray(prevRequests)) {
            return [newFriend];
          }
          return [...prevRequests, newFriend];
        });

        dispatch(
          updateChatListFriendStatusByEmail({
            friend_status: "friend",
            user_email: request.sender_mail,
          })
        );

        dispatch(
          updateChatFriendStatusByEmail({
            friend_status: "friend",
            user_email: request.sender_mail,
          })
        );
        toast.success(`${requests.user_name} is now your friend!`);
      } else if (status === RequestStatus.rejected) {
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.sender_mail !== request.sender_mail)
        );
        toast.success(`The friend request has been successfully rejected.`);
      }
    } else {
      toast.error(
        "An unknown error occurred. Please try again later."
      );
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <BsCheckLg
              onClick={() =>
                updateFriendshipRequest(requests, RequestStatus.accepted)
              }
              className="text-[#3b82f6] h-5 w-5 transition-all duration-500 opacity-70 hover:opacity-100"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Accept</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <LiaTimesSolid
              onClick={() =>
                updateFriendshipRequest(requests, RequestStatus.rejected)
              }
              className="text-[#e11d48] transition-all duration-500 h-5 w-5 opacity-70 hover:opacity-100"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Reject</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default Options;
