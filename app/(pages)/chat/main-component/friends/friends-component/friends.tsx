import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import FriendItem from "./friend-item/item";
import io, { Socket } from "socket.io-client";
import { BlockedModel } from "../blockeds-component/blocked";

export interface FriendsModel {
  friend_mail: string;
  user_name: string;
  user_photo: string;
}

interface FriendsProps {
  friends: FriendsModel[];
  socket: Socket | null;
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendsModel[]>>;
}

const FriendsComponent = ({
  friends,
  socket,
  setBlockedUsers,
  setFriends,
}: FriendsProps) => {
  return (
    <CustomCard className="bg-transparent rounded-md border border-[#5C6B81] flex-1 flex flex-col justify-between">
      <span className="border-b border-[#5C6B81] text-white pl-4 py-2">
        Friends
      </span>
      <ScrollArea className="h-[81dvh] rounded-md">
        <div className="mt-3 p-6 pt-0 relative">
          {friends?.map((reqs) => (
            <FriendItem
              setFriends={setFriends}
              setBlockedUsers={setBlockedUsers}
              socket={socket}
              friends={reqs}
              key={reqs.friend_mail}
            />
          ))}
        </div>
      </ScrollArea>
    </CustomCard>
  );
};

export default FriendsComponent;
