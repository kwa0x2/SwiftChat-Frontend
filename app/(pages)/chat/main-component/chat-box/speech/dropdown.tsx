import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { Message } from "@/models/Message";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";
import { handleSocketEmit } from "@/lib/socket";
import { FaStar } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import {
  deleteLastMessage,
  updateLastMessage,
} from "@/app/redux/slices/chatListSlice";
import { FaRegStar } from "react-icons/fa";

interface DropdownProps {
  msg: Message;
  onEdit?: () => void;
  socket: Socket | null;
  user: any;
  friend: ChatSliceModel;
  isLeftBubble: boolean;
}

const Dropdown = ({
  msg,
  onEdit,
  socket,
  user,
  friend,
  isLeftBubble,
}: DropdownProps) => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  // #region Message Handling Functions
  // Handle deleting a message
  const handleDeleteMessage = () => {
    if (socket && user) {
      handleSocketEmit(
        socket,
        "deleteMessage",
        {
          message_id: msg.message_id,
          room_id: friend.room_id,
          user_email: friend.user_email,
        },
        undefined,
        () => {
          dispatch(
            deleteLastMessage({
              room_id: friend.room_id,
              message_id: msg.message_id,
            })
          );
        },
        () => {
          toast.error(
            "An unknown error occurred while trying to delete the message."
          );
        }
      );
    }
  };

  // Handle updating the starred state of a message
  const handleUpdateMessageStarred = () => {
    if (socket && user) {
      handleSocketEmit(
        socket,
        "updateMessageStarred",
        {
          room_id: friend.room_id,
          message_id: msg.message_id,
          message_starred: !msg.message_starred, // Toggle star state
        },
        undefined,
        undefined,
        () => {
          toast.error(
            "An unknown error occurred while trying to star the message."
          );
        }
      );
    }
  };
  // #endregion

  return (
    <DropdownMenu open={dropdown} onOpenChange={setDropdown}>
      <DropdownMenuTrigger className="outline-none">
        <PiDotsThreeCircleLight className="text-[#4A32B0] text-[2rem]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="backdrop-blur-2xl">
        {!isLeftBubble && (
          <>
            {msg.message_type === "text" && (
              <DropdownMenuItem onClick={onEdit}>
                <MdOutlineDriveFileRenameOutline className="mr-2 text-yellow-600 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={handleDeleteMessage}>
              <AiOutlineDelete className="mr-2 h-4 w-4 text-rose-700" />
              <span>Delete</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleUpdateMessageStarred}>
          {msg.message_starred === true ? (
            <FaRegStar className="mr-2 h-4 w-4 text-[#412c9c]" />
          ) : (
            <FaStar className="mr-2 h-4 w-4 text-[#412c9c]" />
          )}
          <span>{msg.message_starred === true ? "Unstar" : "Star"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
