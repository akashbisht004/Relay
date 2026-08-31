import { useEffect, useRef, useState } from "react";
import type { AgentEvent } from "../types/agent";
import type { Conversation } from "../types/conversation";
import type { Workspace } from "../types/workspace";
import type { Message } from "../types/message";
import AgentActivity from "./AgentActivity";
import ChatInput from "./ChatInput";
import Markdown from "./Markdown";
import Logo from "./Logo";
import type { ModelSelection } from "../types/workspace";

function WorkspaceView({
  selectedWorkspace,
  onSendMessage,
  conversation,
  agentEvents,
  agentError,
  isProcessing,
  modelSelection,
  setModelSelection,
}: {
  selectedWorkspace: Workspace | null;
  onSendMessage: (message: string) => void;
  conversation: Conversation | null;
  agentEvents: AgentEvent[];
  agentError: string | null;
  isProcessing: boolean;
  modelSelection: ModelSelection;
  setModelSelection: React.Dispatch<React.SetStateAction<ModelSelection>>;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length, agentEvents.length, isProcessing, agentError]);

  const hasMessages = conversation && conversation.messages.length > 0;
  const showActivity = isProcessing || agentEvents.length > 0;

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-neutral-950">
      {selectedWorkspace && (
        <div className="flex shrink-0 items-baseline gap-3 border-b border-neutral-800 px-6 py-3">
          <h2 className="text-sm font-medium text-neutral-100">
            {selectedWorkspace.name}
          </h2>

          <p className="truncate font-mono text-xs text-neutral-600">
            {selectedWorkspace.path}
          </p>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!selectedWorkspace ? (
          <EmptyState
            title="No workspace selected"
            hint="Pick a workspace from the sidebar to get started."
          />
        ) : !hasMessages && !showActivity && !agentError ? (
          <EmptyState
            title="Start a conversation"
            hint="Ask the agent to explore, edit, or build something in this workspace."
          />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 pb-40 pt-6">
            {conversation?.messages.map((message, index) => (
              <MessageRow key={message.id ?? index} message={message} />
            ))}

            {showActivity && (
              <div className="flex justify-start gap-3">
                <Logo className="mt-0.5 h-7 w-7" />
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-neutral-800 bg-neutral-900 px-4 py-3">
                  <AgentActivity events={agentEvents} isProcessing={isProcessing} />
                </div>
              </div>
            )}

            {agentError && (
              <div className="flex justify-start gap-3">
                <Logo className="mt-0.5 h-7 w-7" />
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-red-900/60 bg-red-950/40 px-4 py-3">
                  <p className="text-xs font-medium text-red-400">
                    Something went wrong
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-red-200">
                    {agentError}
                  </p>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput
        onSend={onSendMessage}
        isProcessing={isProcessing}
        disabled={!selectedWorkspace}
        modelSelection={modelSelection}
        setModelSelection={setModelSelection}
      />
    </div>
  );
}

function MessageRow({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-neutral-100 px-4 py-2.5 text-sm leading-6 text-neutral-900">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex justify-start gap-3">
      <Logo className="mt-0.5 h-7 w-7" />

      <div className="relative min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-neutral-800 bg-neutral-900 px-4 py-2.5">
        <CopyButton content={message.content} />
        <Markdown content={message.content} />
      </div>
    </div>
  );
}

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — ignore.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded-md border border-neutral-700 bg-neutral-800/80 px-2 py-1 text-[11px] font-medium text-neutral-400 opacity-0 transition hover:text-neutral-100 focus:opacity-100 group-hover:opacity-100"
      aria-label="Copy message"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <Logo className="h-10 w-10 opacity-80" />
      <div>
        <p className="text-sm font-medium text-neutral-300">{title}</p>
        <p className="mt-1 text-sm text-neutral-600">{hint}</p>
      </div>
    </div>
  );
}

export default WorkspaceView;
