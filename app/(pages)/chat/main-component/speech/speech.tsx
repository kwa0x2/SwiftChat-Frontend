import { ScrollArea } from "@/components/ui/scroll-area";
import LeftBubble from "./bubbles/left-bubble";
import RightBubble from "./bubbles/right-bubble";
import { Message } from "@/models/Message";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { MessageItemSliceModel } from "@/app/redux/slices/messageBoxSlice";

interface SpeechProps {
  user: any;
  messages: Message[];
  socket: Socket | null;
  friend: MessageItemSliceModel;

}

const Speech: React.FC<SpeechProps> = ({ user, messages, socket, friend }) => {
  const [oldRoomId, setOldRoomId] = useState<string>("");
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [messageList, setMessageList] = useState<Message[]>(messages);

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  useEffect(() => {
    if (friend.room_id !== "" && friend.room_id !== oldRoomId && messageList.length) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "auto" });
      setOldRoomId(friend.room_id);
    } else if (messageList.length) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);


  return (
    <ScrollArea className="rounded-md">
      <div className="mt-3 p-6 pt-0 relative flex-1 overflow-y-auto">
        {messageList.map((msg) =>
          msg.sender_id === user.id ? (
            <RightBubble
              time={msg.createdAt}
              key={msg.message_id}
              group={false}
              user={user}
              msg={msg}
              socket={socket}
              friend={friend}
            />
          ) : (
            <LeftBubble
              time={msg.createdAt}
              key={msg.message_id}
              group={false}
              user={user}
              msg={msg}
            />
          )
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </ScrollArea>
  );
};

export default Speech;
