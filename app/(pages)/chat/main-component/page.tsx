import FriendsSettings from "@/app/(pages)/chat/main-component/friends/page";
import { RootState, useAppSelector } from "@/app/redux/store";
import io, { Socket } from "socket.io-client";
import Profile from "./profile/page";
import { RequestsModel } from "./friends/requests-component/requests";
import { FriendModel } from "./friends/friends-component/friends";
import { BlockedModel } from "./friends/blocked-component/blocked";
import ChatBox from "./chat-box/chat-box";

interface MainComponentProps {
  user: any;
  socket: Socket | null;
  setRequests: React.Dispatch<React.SetStateAction<RequestsModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendModel[]>>;
  requests: RequestsModel[];
  friends: FriendModel[];
  blockedUsers: BlockedModel[];
  onlineUsers: string[]
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
  isOpenChatList: boolean;
  setIsOpenChatList: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainComponent: React.FC<MainComponentProps> = ({
  user,
  socket,
  setBlockedUsers,
  setRequests,
  setFriends,
  requests,
  friends,
  blockedUsers,
  isOpenChatList,
  setIsOpenChatList
}) => {
  const chatReducerValue = useAppSelector((state) => state.chatReducer.value);
  const componentReducerValue = useAppSelector((state) => state.componentReducer);

  return (
    <>
      {/*friends settings */}

      {componentReducerValue.activeComponent === "friends" && (
        <FriendsSettings
          setBlockedUsers={setBlockedUsers}
          user={user}
          setRequests={setRequests}
          setFriends={setFriends}
          requests={requests}
          friends={friends}
          socket={socket}
          setIsOpenChatList={setIsOpenChatList}
          blockedUsers={blockedUsers}
          isOpenChatList={isOpenChatList}
        />
      )}

      {componentReducerValue.activeComponent === "profile" && <Profile user={user} setIsOpenChatList={setIsOpenChatList} isOpenChatList={isOpenChatList} />}
      {/* chat box */}
      <ChatBox setIsOpenChatList={setIsOpenChatList} isOpenChatList={isOpenChatList} chatReducerValue={chatReducerValue} componentReducerValue={componentReducerValue} user={user} socket={socket} />
    </>
  );
};

export default MainComponent;
