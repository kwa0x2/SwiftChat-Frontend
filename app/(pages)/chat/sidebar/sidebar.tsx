"use client";
import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserProfile from "../user-profile/user-profile";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { ChatListItemModel } from "@/app/redux/slices/chatListSlice";
import { useEffect, useRef, useState } from "react";
import ChatListItem from "./chatList-item";

interface SidebarProps {
  user: any;
  isOpenChatList: boolean;
  setIsOpenChatList: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ user, isOpenChatList, setIsOpenChatList }: SidebarProps) => {
  // #region Redux State and Local State

  // Select chat lists from the Redux store
  const chatLists = useSelector(
    (state: RootState) => state.chatListReducer.chatLists
  );
  const [highlightedRoomIds, setHighlightedRoomIds] = useState<string[]>([]); // Track highlighted room IDs
  const chatListsRef = useRef(chatLists); // Reference for chat lists
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null); // State for selected room ID
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query

  // #endregion

  // Effect to update highlighted room IDs based on chat list changes
  useEffect(() => {
    chatListsRef.current = chatLists;

    // Get room IDs of highlighted messages
    const highlightedIds = chatLists
      ?.filter((msg: ChatListItemModel) => msg.highlight) // Filter messages with highlight set to true
      .map((msg: ChatListItemModel) => msg.room_id); // Map to get the room IDs

    setHighlightedRoomIds(highlightedIds); // Update highlighted room IDs state
  }, [chatLists]);

  // #region Handler Functions

  // Handle item click in the chat list
  const handleItemClick = (room_id: string) => {
    setHighlightedRoomIds((prev) => prev.filter((id) => id !== room_id)); // Remove room ID from highlighted IDs
    setSelectedRoomId(room_id); // Set the selected room ID
    setIsOpenChatList(false); // Close the chat list
  };

  // Filter chat messages based on search query
  const filteredMessages = chatLists
    ?.filter(
      (msg: ChatListItemModel) =>
        msg.user_name.toLowerCase().startsWith(searchQuery.toLowerCase()) // Filter based on user name
    )
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0; // Get timestamp of message A
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0; // Get timestamp of message B
      return dateB - dateA; // Sort by date descending
    });
  // #endregion

  return (
    <CustomCard
      className={`${
        isOpenChatList ? "flex" : "hidden"
      } lg:flex flex-col   min-w-full lg:min-w-[350px] max-h-full`}
    >
      <UserProfile
        user={user}
        onSearch={setSearchQuery}
        setIsOpenChatList={setIsOpenChatList}
        setSelectedRoomId={setSelectedRoomId}
      />
      <ScrollArea className="flex-1 rounded-md overflow-auto">
        <div className="pt-3">
          {filteredMessages?.map((chatList: ChatListItemModel) => (
            <ChatListItem
              chatList={chatList}
              key={chatList.room_id}
              highlight={highlightedRoomIds?.includes(chatList.room_id)}
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
