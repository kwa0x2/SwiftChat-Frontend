import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import FriendItem from "./friend-item/item";

export interface FriendsModel {
  friend_mail: string;
  user_name: string;
  user_photo: string;
}

interface FriendsProps {
  friends: FriendsModel[];
}


const FriendsComponent = ({friends}: FriendsProps) => {
  return (
    <CustomCard className="bg-transparent rounded-md border border-[#5C6B81] flex-1 flex flex-col justify-between">
      <span className="border-b border-[#5C6B81] text-white pl-4 py-2">
        Friends
      </span>
      <ScrollArea className="h-[81dvh] rounded-md">
        <div className="mt-3 p-6 pt-0 relative">
          {friends?.map((reqs) => (
            <FriendItem friends={reqs} key={reqs.friend_mail} />
          ))}
        </div>
      </ScrollArea>
    </CustomCard>
  );
};

// benim adim ibo

export default FriendsComponent;
