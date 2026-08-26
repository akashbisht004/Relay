import { useState } from "react";
import type { ClientMessage } from "../types/websocket";
import type { Workspace } from "../types/workspace";

type ChatInputProps = {
  sendMessage: (message: ClientMessage) => void;
  selectedWorkspace: Workspace | null;
};

function ChatInput({ sendMessage, selectedWorkspace }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;
    sendMessage({
      type: "chat_message",
      workspaceId: selectedWorkspace!.id,
      message,
    });
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
        <div className="pointer-events-auto flex items-end rounded-2xl border border-zinc-300 bg-white p-2 shadow-lg">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={1}
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 outline-none"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim()}
            className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
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
