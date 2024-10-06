"use client";
import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserProfile from "../user-profile/user-profile";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { ChatListItemModel } from "@/app/redux/slices/chatListSlice";
import { useState } from "react";
import ChatListItem from "./chatList-item";

interface SidebarProps {
  user: any;
  highlightedRoomId: string | null;
  setHighlightedRoomId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Sidebar = ({ user, highlightedRoomId, setHighlightedRoomId }: SidebarProps) => {
  const chatLists = useSelector(
    (state: RootState) => state.chatListReducer.chatLists
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleItemClick = (room_id: string) => {
    setSelectedRoomId(room_id);
    if (highlightedRoomId === room_id) {
      setHighlightedRoomId(null);
    }
  };
  
  const filteredMessages = chatLists?.filter((msg: ChatListItemModel) =>
    msg.user_name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <CustomCard className="hidden lg:flex flex-col flex-none min-w-[260px] max-h-full">
      <UserProfile user={user} onSearch={setSearchQuery} />
      <ScrollArea className="flex-1 rounded-md overflow-auto">
        <div className="pt-3">
          {filteredMessages?.map((chatList: ChatListItemModel) => (
            <ChatListItem
              chatList={chatList}
              key={chatList.room_id}
              highlight={chatList.room_id === highlightedRoomId}
              selected={chatList.room_id === selectedRoomId}
              onClick={() => handleItemClick(chatList.room_id)}
            />
          ))}
        </div>
      </ScrollArea>
    </CustomCard>
  );
};

export default Sidebar;
