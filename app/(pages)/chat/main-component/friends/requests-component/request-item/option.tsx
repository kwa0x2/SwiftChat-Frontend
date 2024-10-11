import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsCheckLg } from "react-icons/bs";
import { LiaTimesSolid } from "react-icons/lia";
import { RequestStatus } from "@/models/Enum";
import { toast } from "sonner";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { UpdateFriendshipRequest } from "@/app/api/services/request.Service";
import { handleFriendStatusUpdate } from "@/lib/slice";
import { FriendModel } from "@/models/Friend";
import { RequestsModel } from "@/models/Request";

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

  //#region Update Friendship Request Function
  const updateFriendshipRequest = async (
    request: RequestsModel,
    status: RequestStatus
  ) => {
    const res = await UpdateFriendshipRequest(request.sender_email, status);

    if (res.status === 200) {
      // If the request is accepted
      if (status === RequestStatus.accepted) {
        // Remove the request from the list
        setRequests((prevRequests) =>
          prevRequests?.filter((req) => req.sender_email !== request.sender_email)
        );

        // Create a new friend model
        const newFriend: FriendModel = {
          friend_email: request.sender_email,
          user_name: requests.user_name,
          user_photo: request.user_photo,
          activeStatus: request.activeStatus,
        };

        // Update the friends list
        setFriends((prevFriends) => {
          return Array.isArray(prevFriends)
            ? [...prevFriends, newFriend] // Add new friend
            : [newFriend]; // Create an array if it was not an array
        });

        handleFriendStatusUpdate(dispatch, request.sender_email, "friend");

        // Notify the user of success
        toast.success(`${requests.user_name} is now your friend!`);
      }
      // If the request is rejected
      else if (status === RequestStatus.rejected) {
        // Remove the request from the list
        setRequests((prevRequests) =>
          prevRequests?.filter((req) => req.sender_email !== request.sender_email)
        );
        toast.success(`The friend request has been successfully rejected.`);
      }
    } else {
      // Notify the user of an error
      toast.error("An unknown error occurred. Please try again later.");
    }
  };
  //#endregion

  return (
    <>
      {/* Accept Friend Request Button */}
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

      {/* Reject Friend Request Button */}
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
