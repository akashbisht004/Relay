import { useState } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
};

function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSend(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4">
      <div className="mx-auto max-w-3xl">
        <div className="pointer-events-auto flex items-end gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/90 p-2 shadow-xl backdrop-blur">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={1}
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim()}
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Send message"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
