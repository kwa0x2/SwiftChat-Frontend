"use client";
import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import RequestItem from "./request-item/item";
import { useEffect, useState } from "react";
import { ComingRequests } from "@/app/api/services/request.Service";
import io, { Socket } from "socket.io-client";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FriendsModel } from "../friends-component/friends";

export interface ComingRequestsModel {
  sender_mail: string;
  user_name: string;
  user_photo: string;
}

interface RequestsProps {
  requests: ComingRequestsModel[];
  setRequests: React.Dispatch<React.SetStateAction<ComingRequestsModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendsModel[]>>;

  socket: Socket | null;
}

const RequestsComponent = ({ requests,setRequests, socket, setFriends }: RequestsProps) => {
  return (
    <CustomCard className="bg-transparent rounded-md border border-[#5C6B81] flex-1 flex flex-col justify-between">
      <span className="border-b border-[#5C6B81] text-white pl-4 py-2">
        Coming Requests
      </span>
      <ScrollArea className="h-full rounded-md">
        <div className="mt-3 p-6 pt-0 relative">
          {requests?.map((reqs) => (
            <RequestItem
              requests={reqs}
              key={reqs.sender_mail}
              socket={socket}
              setRequests={setRequests}
              setFriends={setFriends}
            />
          ))}
        </div>
      </ScrollArea>
    </CustomCard>
  );
};

export default RequestsComponent;
