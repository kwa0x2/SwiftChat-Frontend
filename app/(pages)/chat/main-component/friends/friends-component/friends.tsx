import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import FriendItem from "./friend-item/item";
import { BlockedModel } from "../blocked-component/blocked";

export interface FriendModel {
  friend_mail: string;
  user_name: string;
  user_photo: string;
}

export interface FriendsProps {
  friends: FriendModel[];
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendModel[]>>;
}

const FriendsComponent = ({
  friends,
  setBlockedUsers,
  setFriends,
}: FriendsProps) => {
  return (
    <CustomCard className="bg-transparent rounded-md border border-[#5C6B81] flex-1 flex flex-col">
      <span className="border-b border-[#5C6B81] text-white pl-4 py-2">
        Friends
      </span>
      <ScrollArea className="h-[81dvh] rounded-md p-4">
        {friends?.map((friend) => (

                <FriendItem
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
