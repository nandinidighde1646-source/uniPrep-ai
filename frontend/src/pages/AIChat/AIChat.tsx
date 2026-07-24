import { useState } from "react";

import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatInput from "../../components/ChatInput/ChatInput";

import { aiResponses } from "../../data/aiResponses";
import type { ChatMessage } from "../../types/chat";

function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "ai",
      message: "Hello! I'm UniPrep AI. Ask me anything about your subjects.",
    },
  ]);

  const handleSend = (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      message: text,
    };

    const response =
      aiResponses[text.toLowerCase()] || aiResponses.default;

    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      sender: "ai",
      message: response,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">

      <div className="bg-blue-600 text-white p-4 text-xl font-semibold">
        🤖 UniPrep AI Assistant
      </div>

      <ChatWindow messages={messages} />

      <ChatInput onSend={handleSend} />

    </div>
  );
}

export default AIChat;