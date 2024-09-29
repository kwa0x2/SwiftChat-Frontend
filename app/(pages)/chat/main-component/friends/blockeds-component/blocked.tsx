"use client";

import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import BlockedItem from "./blocked-item/item";
import io, { Socket } from "socket.io-client";

export interface BlockedModel {
  blocked_mail: string;
  user_name: string;
}

interface BlockedProps {
  blockedUsers: BlockedModel[];
  socket: Socket | null;
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;

}

const BlockedComponent = ({ blockedUsers, socket,setBlockedUsers }: BlockedProps) => {
  return (
    <CustomCard className="bg-transparent rounded-md border border-[#5C6B81] flex-1 flex flex-col justify-between">
      <span className="border-b border-[#5C6B81] text-white pl-4 py-2">
        Blocked users
      </span>
      <ScrollArea className="h-full rounded-md">
        <div className="mt-3 p-6 pt-0 relative">
          {blockedUsers?.map((reqs) => (
            <BlockedItem
            setBlockedUsers={setBlockedUsers}
              blocked={reqs}
              key={reqs.blocked_mail}
              socket={socket}
            />
          ))}
        </div>
      </ScrollArea>
    </CustomCard>
  );
};

export default BlockedComponent;
