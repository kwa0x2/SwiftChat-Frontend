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

}

const FriendsSettings = ({ socket, user, setRequests, setFriends, requests, friends, blockedUsers }: FriendsSettingsProps) => {
  useEffect(() => {


    // if (user && user.email && socket) {
    //   Promise.all([
    //     getRequestData(),
    //     getFriendsData(),
    //     GetBlockedUsersData(),
    //   ]).then(() => {
    //     if (socket) {
    //       socket.off(user.email);

    //       console.warn("aa2", user.email);

    //       socket.on(user.email, (response: any) => {
    //         console.warn("aa", response);

    //         if (response.action === "update_friendship_request") {

    //           console.warn("aares", response.data);

    //           if (response.data.status === "accepted") {
    //             setFriends((prevRequests) => {
    //               if (!Array.isArray(prevRequests)) {
    //                 return [response.data.user_data];
    //               }
    //               return [...prevRequests, response.data.user_data];
    //             });
    //             toast.success(`${response.data.user_data.user_name} is now your friend!`);

    //           }else if (response.data.status === "rejected") {
    //             toast.info(`${response.data.user_data.user_name} has rejected your friend request.`);

    //           }
    //           // toast.info(
    //           //   `${res.data.user_name} has sent you a friend request.`
    //           // );
    //         } else if (response.action === "friend_request") {
    //           setRequests((prevRequests) => {
    //             if (!Array.isArray(prevRequests)) {
    //               return [response.data];
    //             }
    //             return [...prevRequests, response.data];
    //           });
    //           toast.info(
    //             `${response.data.user_name} has sent you a friend request.`
    //           );
    //         }
    //       });
    //     }
    //   });
    // }

    // return () => {
    //   if (socket) socket.off(user.email);
    // };
  }, [socket, user]);

  return (
    <CustomCard className="flex-1 flex-col justify-between">
      <AddFriend socket={socket} user={user} />
      <div className="grid grid-cols-2 flex-1 gap-4 p-5">
        <FriendsComponent friends={friends} />
        <div className="flex flex-col h-full gap-4">
          <RequestsComponent requests={requests} socket={socket} setRequests={setRequests} setFriends={setFriends} />
          <BlockedComponent blockedUsers={blockedUsers} />
        </div>
      </div>
    </CustomCard>
  );
};

export default FriendsSettings;
