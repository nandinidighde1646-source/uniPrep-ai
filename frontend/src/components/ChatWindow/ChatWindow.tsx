import ChatMessage from "../ChatMessage/ChatMessage";
import type { ChatMessage as ChatMessageType } from "../../types/chat";

type ChatWindowProps = {
  messages: ChatMessageType[];
};

function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
        />
      ))}
    </div>
  );
}

export default ChatWindow;