import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import RequestItem from "./request-item/item";
import { FriendModel } from "../friends-component/friends";

export interface RequestsModel {
  sender_mail: string;
  user_name: string;
  user_photo: string;
  activeStatus: boolean;
}

interface RequestsProps {
  requests: RequestsModel[];
  setRequests: React.Dispatch<React.SetStateAction<RequestsModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendModel[]>>;
}

const RequestsComponent = ({ requests, setRequests, setFriends }: RequestsProps) => {


  return (
    <CustomCard className="bg-transparent rounded-md border border-[#5C6B81] flex-1 flex flex-col h-full" >
      <span className="border-b border-[#5C6B81] text-white pl-4 py-2">Requests</span>
      <ScrollArea className="flex-1 rounded-md pt-4">
      {requests?.map((reqs) => (
            <RequestItem
              requests={reqs}
              key={reqs.sender_mail}
              setRequests={setRequests}
              setFriends={setFriends}
            />
          ))}
      </ScrollArea>
    </CustomCard>
  );
};

export default RequestsComponent;
