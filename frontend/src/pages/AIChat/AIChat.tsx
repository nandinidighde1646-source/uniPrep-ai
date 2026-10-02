import { useState } from "react";
import api from "../../services/api";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatInput from "../../components/ChatInput/ChatInput";

import type { ChatMessage } from "../../types/chat";

function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "ai",
      message: "Hello! I'm UniPrep AI. Ask me anything about your subjects.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      message: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await api.post(
  "/api/ai/chat",
  {
    message: text,
    history: messages,
  }
);

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        message: response.data.message,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        message: "Sorry, I couldn't generate a response. Please try again.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">

      <div className="bg-blue-600 text-white p-4 text-xl font-semibold">
        🤖 UniPrep AI Assistant
      </div>

      <ChatWindow messages={messages} />

      <ChatInput onSend={handleSend} />

      {loading && (
        <div className="text-sm text-gray-500 px-4 pb-2">
          UniPrep AI is thinking...
        </div>
      )}

    </div>
  );
}

export default AIChat;