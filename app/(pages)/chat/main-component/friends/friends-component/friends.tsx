import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import FriendItem from "./friend-item/item";
import { BlockedModel } from "../blocked-component/blocked";
import { Socket } from "socket.io-client";

export interface FriendModel {
  friend_mail: string;
  user_name: string;
  user_photo: string;
  activeStatus: boolean;
}

export interface FriendsProps {
  friends: FriendModel[];
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendModel[]>>;
  socket: Socket | null

}

const FriendsComponent = ({ friends, setBlockedUsers, setFriends, socket }: FriendsProps) => {

  return (
    <CustomCard className="bg-transparent rounded-md border border-[#5C6B81]  flex flex-col h-full">
      <span className="border-b border-[#5C6B81] text-white pl-4 py-2">Friends</span>
      <ScrollArea className="flex-1 rounded-md pt-4 ">
        {friends?.map((friend) => (
          <FriendItem
          socket={socket}
            key={friend.friend_mail}
            friend={friend}
            setFriends={setFriends}
            setBlockedUsers={setBlockedUsers}
          />
        ))}
      </ScrollArea>
    </CustomCard>
  );
};

export default FriendsComponent;
