import { useRef, useState } from "react";
import type { ModelSelection } from "../types/workspace";
import { Spinner } from "./Loader";

type ChatInputProps = {
  onSend: (message: string) => void;
  isProcessing: boolean;
  disabled?: boolean;
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
      value: "gemini-3.5-flash",
    },
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
  isProcessing,
  disabled = false,
  modelSelection,
  setModelSelection,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = message.trim() !== "" && !isProcessing && !disabled;

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isProcessing || disabled) return;

    onSend(trimmedMessage);
    setMessage("");

    const el = textareaRef.current;
    if (el) el.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as ModelSelection["provider"];

    setModelSelection({
      provider,
      model: models[provider][0].value,
    });
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModelSelection((prev) => ({
      ...prev,
      model: e.target.value,
    }));
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent px-4 pb-4 pt-8">
      <div className="mx-auto max-w-3xl">
        <div className="pointer-events-auto rounded-2xl border border-neutral-800 bg-neutral-900/90 p-2 shadow-xl backdrop-blur transition focus-within:border-neutral-700">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                resizeTextarea();
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                disabled ? "Select a workspace to chat..." : "Message the agent..."
              }
              rows={1}
              disabled={disabled}
              className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 disabled:cursor-not-allowed"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={isProcessing ? "Agent is working" : "Send message"}
            >
              {isProcessing ? (
                <Spinner className="h-4 w-4 text-neutral-500" />
              ) : (
                <span aria-hidden="true">↑</span>
              )}
            </button>
          </div>

          <div className="mt-1 flex items-center gap-2 px-2 pb-1">
            <select
              value={modelSelection.provider}
              onChange={handleProviderChange}
              className="rounded-lg bg-neutral-800 px-2 py-1.5 text-xs text-neutral-300 outline-none transition hover:bg-neutral-700"
            >
              <option value="gemini">Gemini</option>
              <option value="claude">Claude</option>
              <option value="openai">OpenAI</option>
            </select>

            <select
              value={modelSelection.model}
              onChange={handleModelChange}
              className="rounded-lg bg-neutral-800 px-2 py-1.5 text-xs text-neutral-300 outline-none transition hover:bg-neutral-700"
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
