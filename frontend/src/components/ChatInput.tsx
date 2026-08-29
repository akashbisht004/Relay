import { useState } from "react";
import type { ModelSelection } from "../types/workspace";

type ChatInputProps = {
  onSend: (message: string) => void;
  modelSelection: ModelSelection;
  setModelSelection: React.Dispatch<React.SetStateAction<ModelSelection>>;
};

const models = {
  gemini: [
    {
      label: "Gemini 3.6 Flash",
      value: "gemini-3.6-flash",
    },
    {
      label: "Gemini 3.5 Flash",
      value: "gemini-3.6-flash",
    }
  ],

  claude: [
    {
      label: "Claude Sonnet",
      value: "claude-sonnet-4",
    },
  ],

  openai: [
    {
      label: "GPT-5",
      value: "gpt-5",
    },
  ],
};

function ChatInput({
  onSend,
  modelSelection,
  setModelSelection,
}: ChatInputProps) {
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

  const handleProviderChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const provider = e.target.value as ModelSelection["provider"];

    setModelSelection({
      provider,
      model: models[provider][0].value,
    });
  };

  const handleModelChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setModelSelection((prev) => ({
      ...prev,
      model: e.target.value,
    }));
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4">
      <div className="mx-auto max-w-3xl">
        <div className="pointer-events-auto rounded-2xl border border-neutral-800 bg-neutral-900/90 p-2 shadow-xl backdrop-blur">

          <div className="flex items-end gap-2">
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

          <div className="mt-1 flex items-center gap-2 px-2 pb-1">

            <select
              value={modelSelection.provider}
              onChange={handleProviderChange}
              className="rounded-lg bg-neutral-800 px-2 py-1.5 text-xs text-neutral-300 outline-none hover:bg-neutral-700"
            >
              <option value="gemini">Gemini</option>
              <option value="claude">Claude</option>
              <option value="openai">OpenAI</option>
            </select>

            <select
              value={modelSelection.model}
              onChange={handleModelChange}
              className="rounded-lg bg-neutral-800 px-2 py-1.5 text-xs text-neutral-300 outline-none hover:bg-neutral-700"
            >
              {models[modelSelection.provider].map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
