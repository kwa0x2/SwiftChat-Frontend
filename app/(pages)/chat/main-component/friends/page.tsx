import CustomCard from "@/components/custom-card";
import AddFriend from "./add-friends";
import FriendsComponent, { FriendsModel } from "./friends-component/friends";
import RequestsComponent, {
  ComingRequestsModel,
} from "./requests-component/requests";
import BlockedComponent, {
  BlockedModel,
} from "@/app/(pages)/chat/main-component/friends/blockeds-component/blocked";
import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ComingRequests } from "@/app/api/services/request.Service";
import { Blocked, Friends } from "@/app/api/services/friendship.Service";

interface FriendsSettingsProps {
  socket: Socket | null;
  user: any;
  setRequests: React.Dispatch<React.SetStateAction<ComingRequestsModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendsModel[]>>;
  requests: ComingRequestsModel[];
  friends: FriendsModel[];
  blockedUsers: BlockedModel[];
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;

}

const FriendsSettings = ({
  socket,
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
      <AddFriend socket={socket} user={user} />
      <div className="grid grid-cols-2 flex-1 gap-4 p-5">
        <FriendsComponent
          setFriends={setFriends}
          friends={friends}
          socket={socket}
          setBlockedUsers={setBlockedUsers}
        />
        <div className="flex flex-col h-full gap-4">
          <RequestsComponent
            requests={requests}
            socket={socket}
            setRequests={setRequests}
            setFriends={setFriends}
          />
          <BlockedComponent setBlockedUsers={setBlockedUsers} blockedUsers={blockedUsers} socket={socket}/>
        </div>
      </div>
    </CustomCard>
  );
};

export default FriendsSettings;
