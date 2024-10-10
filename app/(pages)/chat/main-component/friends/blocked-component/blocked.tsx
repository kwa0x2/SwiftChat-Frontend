"use client";
import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import BlockedItem from "./blocked-item/item";
import { Socket } from "socket.io-client";

export interface BlockedModel {
  blocked_mail: string;
  user_name: string;
}

interface BlockedProps {
  blockedUsers: BlockedModel[];
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
}

const BlockedComponent = ({ blockedUsers, setBlockedUsers }: BlockedProps) => {


  return (
    <CustomCard className="bg-transparent rounded-md border border-[#5C6B81] flex flex-col h-full">
      <span className="border-b border-[#5C6B81] text-white pl-4 py-2">
        Blocked users
      </span>
      <ScrollArea className="flex-1 rounded-md pt-4">
        {blockedUsers?.map((blockedUser) => (
          <BlockedItem
            key={blockedUser.blocked_mail}
            blockedUser={blockedUser}
            setBlockedUsers={setBlockedUsers}
          />
        ))}
      </ScrollArea>
    </CustomCard>
  );
};

export default BlockedComponent;
