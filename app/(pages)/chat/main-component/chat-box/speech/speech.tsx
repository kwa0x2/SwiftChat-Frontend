import { ScrollArea } from "@/components/ui/scroll-area";
import LeftBubble from "./bubbles/left-bubble";
import RightBubble from "./bubbles/right-bubble";
import { Message } from "@/models/Message";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";

interface SpeechProps {
  user: any;
  messages: Message[];
  socket: Socket | null;
  friend: ChatSliceModel;
}

const Speech: React.FC<SpeechProps> = ({ user, messages, socket, friend }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="rounded-md">
    <div className="mt-3 p-6 pt-0 z-20 relative flex-1 overflow-y-auto">
      {messages.map((msg) =>
        msg.sender_id === user.id ? (
          <RightBubble
            key={msg.message_id}
            group={false}
            user={user}
            msg={msg}
            socket={socket}
            friend={friend}
          />
        ) : (
          <LeftBubble
            key={msg.message_id}
            group={false}
            user={user}
            msg={msg}
            friend={friend}
            socket={socket}
          />
        )
      )}
      <div ref={endOfMessagesRef} />
    </div>
  </ScrollArea>
  );
};

export default Speech;
