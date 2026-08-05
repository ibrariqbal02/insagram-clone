import { Send } from "lucide-react";
import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  loading: boolean;
};

const MessageInput = ({
  onSend,
  loading,
}: Props) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);

    setText("");
  };

  return (
    <div className="border-t bg-white p-4 flex gap-3">

      <input
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        placeholder="Type a message..."
        className="flex-1 rounded-full border px-4 py-3 outline-none"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="rounded-full bg-blue-600 p-3 text-white"
      >
        <Send size={20} />
      </button>

    </div>
  );
};

export default MessageInput;