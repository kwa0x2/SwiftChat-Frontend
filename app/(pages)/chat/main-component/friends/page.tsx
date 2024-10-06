import CustomCard from "@/components/custom-card";
import AddFriend from "./add-friends";
import FriendsComponent, { FriendModel } from "./friends-component/friends";
import RequestsComponent, {
  ComingRequestsModel,
} from "./requests-component/requests";
import BlockedComponent, {
  BlockedModel,
} from "@/app/(pages)/chat/main-component/friends/blocked-component/blocked";
import { Socket } from "socket.io-client";

interface FriendsSettingsProps {
  user: any;
  setRequests: React.Dispatch<React.SetStateAction<ComingRequestsModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendModel[]>>;
  requests: ComingRequestsModel[];
  friends: FriendModel[];
  blockedUsers: BlockedModel[];
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
}

const FriendsSettings = ({
  user,
  setBlockedUsers,
  setRequests,
  setFriends,
  requests,
  friends,
  blockedUsers,
}: FriendsSettingsProps) => {
  return (
    <CustomCard className="flex-1 flex-col justify-between">
      <AddFriend  user={user} />
      <div className="grid grid-cols-2 flex-1 gap-4 p-5">
        <FriendsComponent
          setFriends={setFriends}
          friends={friends}
          setBlockedUsers={setBlockedUsers}
        />
        <div className="flex flex-col h-full gap-4">
          <RequestsComponent
            requests={requests}
            setRequests={setRequests}
            setFriends={setFriends}
          />
          <BlockedComponent
            setBlockedUsers={setBlockedUsers}
            blockedUsers={blockedUsers}
          />
        </div>
      </div>
    </CustomCard>
  );
};

export default FriendsSettings;
