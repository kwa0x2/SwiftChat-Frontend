import FriendsSettings from "@/app/(pages)/chat/main-component/friends/page";
import ChatBox from "@/app/(pages)/chat/main-component/chat-box/chat-box";
import { useAppSelector } from "@/app/redux/store";
import io, { Socket } from "socket.io-client";
import { SetStateAction, useEffect, useState } from "react";
import Profile from "./profile/page";
import { ComingRequestsModel } from "./friends/requests-component/requests";
import { FriendsModel } from "./friends/friends-component/friends";
import { BlockedModel } from "./friends/blockeds-component/blocked";

interface MainComponentProps {
  user: any;
  socket: Socket | null;
  setRequests: React.Dispatch<React.SetStateAction<ComingRequestsModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendsModel[]>>;
  requests: ComingRequestsModel[];
  friends: FriendsModel[];
  blockedUsers: BlockedModel[];
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;

}

const MainComponent: React.FC<MainComponentProps> = ({ user, socket,setBlockedUsers,setRequests,setFriends,requests,friends,blockedUsers }) => {
  const chatBoxValue = useAppSelector((state) => state.messageBoxReducer.value);
  return (
    <>
      {/*friends settings */}

      {chatBoxValue.activeComponent === "friends" && <FriendsSettings setBlockedUsers={setBlockedUsers} socket={socket} user={user} setRequests={setRequests} setFriends={setFriends} requests={requests} friends={friends} blockedUsers={blockedUsers} />}

      {chatBoxValue.activeComponent === "profile" && (
        <Profile  user={user}/>
      )}
      {/* chat box */}
      <ChatBox chatBoxValue={chatBoxValue} user={user} socket={socket} />
    </>
  );
};

export default MainComponent;
