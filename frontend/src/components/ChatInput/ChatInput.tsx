import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

type ChatInputProps = {
  onSend: (message: string) => void;
};

function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");       //useStatesnippet usf

  const handleSend = () => {
    if (!input.trim()) return;

    onSend(input);
    setInput("");
  };

  return (
    <div className="flex gap-3 p-4 border-t bg-white">

      <input
        type="text"
        placeholder="Ask anything..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700 transition"
      >
        <FaPaperPlane />
      </button>

    </div>
  );
}

export default ChatInput;