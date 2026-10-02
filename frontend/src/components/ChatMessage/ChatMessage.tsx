import ReactMarkdown from "react-markdown";
import type { ChatMessage as ChatMessageType } from "../../types/chat";

type ChatMessageProps = {
  message: ChatMessageType;
};

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[70%] px-4 py-3 rounded-xl ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {isUser ? (
          message.message
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;