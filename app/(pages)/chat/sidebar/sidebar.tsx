"use client";
import { getChatListHistory } from "@/app/api/services/room.Service";
import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import UserProfile from "../user-profile/user-profile";
import MessageItem from "./message-item";
import { Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  MessageItemModel,
  setChatList,
  updateLastMessage,
} from "@/app/redux/slices/chatlistSlice";

interface SidebarProps {
  user: any;
  highlightedRoomId: string | null
  setHighlightedRoomId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Sidebar: React.FC<SidebarProps> = ({ user, highlightedRoomId, setHighlightedRoomId }) => {
  const listMessages = useSelector(
    (state: RootState) => state.chatListReducer.messages
  );

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleItemClick = (room_id: string) => {
    setSelectedRoomId(room_id);
    if (highlightedRoomId === room_id) {
      setHighlightedRoomId(null);
    }
  };

  const filteredMessages = listMessages?.filter((msg: MessageItemModel) =>
    msg.user_name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <CustomCard className="hidden lg:flex flex-col flex-none min-w-[260px] max-h-full">
      <UserProfile user={user} onSearch={setSearchQuery} />
      <ScrollArea className="flex-1 rounded-md overflow-auto">
        <div className="pt-3">
          {filteredMessages?.map((msg: any) => (
            <MessageItem
              message={msg}
              key={msg.room_id}
              highlight={msg.room_id === highlightedRoomId}
              selected={msg.room_id === selectedRoomId}
              onClick={() => handleItemClick(msg.room_id)}
            />
          ))}
        </div>
      </ScrollArea>
    </CustomCard>
  );
};

export default Sidebar;
