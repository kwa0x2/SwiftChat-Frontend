import CustomCard from "@/components/custom-card";
import AddFriend from "./add-friends";
import FriendsComponent, { FriendModel } from "./friends-component/friends";
import RequestsComponent, {
  RequestsModel,
} from "./requests-component/requests";
import BlockedComponent, { BlockedModel } from "./blocked-component/blocked";
import { Socket } from "socket.io-client";

interface FriendsSettingsProps {
  user: any;
  setRequests: React.Dispatch<React.SetStateAction<RequestsModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendModel[]>>;
  requests: RequestsModel[];
  friends: FriendModel[];
  blockedUsers: BlockedModel[];
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
  setIsOpenChatList: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenChatList: boolean;
  socket: Socket | null

}

const FriendsSettings = ({
  user,
  setBlockedUsers,
  setRequests,
  setFriends,
  requests,
  friends,
  blockedUsers,
  setIsOpenChatList,
  isOpenChatList,
  socket
}: FriendsSettingsProps) => {
  return (
    <CustomCard
      className={`  ${isOpenChatList ? "hidden" : "flex flex-col flex-1 max-h-full"} `}
    >
      {/* AddFriend component at the top */}
      <div className="">
        <AddFriend user={user} setIsOpenChatList={setIsOpenChatList} isOpenChatList={isOpenChatList} />
      </div>
      {/* Grid layout for friends, requests, and blocked users */}
      <div className="flex-1 grid grid-cols-1 gap-4 p-5 max-h-full sm:grid-cols-3 overflow-auto">
        <div className="flex flex-col max-h-full overflow-auto">
          <FriendsComponent
          socket={socket}
            setFriends={setFriends}
            friends={friends}
            setBlockedUsers={setBlockedUsers}
          />
        </div>
        <div className="flex flex-col  max-h-full overflow-auto">
          <RequestsComponent
            requests={requests}
            setRequests={setRequests}
            setFriends={setFriends}
          />
        </div>
        <div className="flex flex-col  max-h-full overflow-auto">
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
