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
import { MessageItemSliceModel } from "@/app/redux/slices/messageBoxSlice";

interface DropdownProps {
  msg: Message;
  onEdit: () => void;
  socket: Socket | null;
  user: any;
  friend: MessageItemSliceModel;
}

const Dropdown = ({
  msg,
  onEdit,
  socket,
  user,
  friend,
}: DropdownProps) => {
  const [dropdown, setDropdown] = useState<boolean>(false);

  const handleDelete = async () => {
    if (socket && user) {
      let message_id = msg.message_id;
      let other_user_email = friend.other_user_email;
      let room_id = friend.room_id;

      socket.emit("deleteMessage", {
        message_id,
        room_id,
        other_user_email,
      });
    }
  };

  return (
    <DropdownMenu open={dropdown} onOpenChange={setDropdown}>
      <DropdownMenuTrigger className="outline-none">
        <PiDotsThreeCircleLight className="text-[#4A32B0] text-[2rem]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="backdrop-blur-2xl">
        <DropdownMenuItem onClick={onEdit}>
          <MdOutlineDriveFileRenameOutline className="mr-2 text-yellow-600 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>
          <AiOutlineDelete className="mr-2 h-4 w-4 text-rose-700" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
