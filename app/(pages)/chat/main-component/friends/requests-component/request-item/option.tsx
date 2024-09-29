import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsCheckLg } from "react-icons/bs";
import { LiaTimesSolid } from "react-icons/lia";
import { ComingRequestsModel } from "../requests";
import { UpdateFriendshipRequest } from "@/app/api/services/request.Service";
import { RequestStatus } from "@/models/Enum";
import { toast } from "sonner";
import io, { Socket } from "socket.io-client";
import { FriendsModel } from "../../friends-component/friends";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import {
  updateChatListDeletedAtByEmail,
  updateChatListFriendStatusByEmail,
} from "@/app/redux/slices/chatlistSlice";
import {
  updateMessageBoxDeletedAtByEmail,
  updateMessageBoxFriendStatusByEmail,
} from "@/app/redux/slices/messageBoxSlice";

interface ComingRequestsProps {
  requests: ComingRequestsModel;
  socket: Socket | null;
  setRequests: React.Dispatch<React.SetStateAction<ComingRequestsModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendsModel[]>>;
}

const Options: React.FC<ComingRequestsProps> = ({
  requests,
  socket,
  setRequests,
  setFriends,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOnClick = async (
    sender_mail: string,
    status: RequestStatus,
    senderName: string
  ) => {
    console.warn("sender_mail", sender_mail);
    if (socket) {
      console.warn("socket", sender_mail);

      socket.emit(
        "updateFriendshipRequest",
        {
          status,
          sender_mail,
        },
        (response: any) => {
          console.warn(response);
          if (response.status === "error") {
            toast.error("An unknown error occurred. Please try again later");
          } else if (
            response.status === "success" &&
            status === RequestStatus.accepted
          ) {
            toast.success(`${senderName} is now your friend!`);
            setRequests((prevRequests) =>
              prevRequests.filter((req) => req.sender_mail !== sender_mail)
            );

            const newFriend: FriendsModel = {
              friend_mail: sender_mail,
              user_name: senderName,
              user_photo: requests.user_photo,
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
                user_email: sender_mail,
              })
            );

            dispatch(
              updateChatListDeletedAtByEmail({
                user_email: sender_mail,
                deletedAt: null,
              })
            );
            dispatch(
              updateMessageBoxDeletedAtByEmail({
                user_email: sender_mail,
                deletedAt: null,
              })
            );
            dispatch(
              updateMessageBoxFriendStatusByEmail({
                friend_status: "friend",
                user_email: sender_mail,
              })
            );
          } else if (
            response.status === "success" &&
            status === RequestStatus.rejected
          ) {
            toast.success("The friend request has been successfully rejected.");
            setRequests((prevRequests) =>
              prevRequests.filter((req) => req.sender_mail !== sender_mail)
            );
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
            <BsCheckLg
              onClick={() =>
                handleOnClick(
                  requests.sender_mail,
                  RequestStatus.accepted,
                  requests.user_name
                )
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
                handleOnClick(
                  requests.sender_mail,
                  RequestStatus.rejected,
                  requests.user_name
                )
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
