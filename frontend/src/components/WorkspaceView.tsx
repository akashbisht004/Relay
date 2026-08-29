import { useEffect, useRef } from "react";
import type { AgentEvent } from "../types/agent";
import type { Conversation } from "../types/conversation";
import type { Workspace } from "../types/workspace";
import AgentActivity from "./AgentActivity";
import ChatInput from "./ChatInput";

function WorkspaceView({
  selectedWorkspace,
  onSendMessage,
  conversation,
  agentEvents,
}: {
  selectedWorkspace: Workspace | null;
  onSendMessage: (message: string) => void;
  conversation: Conversation | null;
  agentEvents: AgentEvent[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length, agentEvents.length]);

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-neutral-950">
      {selectedWorkspace && (
        <div className="shrink-0 border-b border-neutral-800 px-6 py-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-sm font-medium text-neutral-100">
              {selectedWorkspace.name}
            </h2>

            <p className="truncate font-mono text-xs text-neutral-600">
              {selectedWorkspace.path}
            </p>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!selectedWorkspace ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-600">
            Select a workspace
          </div>
        ) : !conversation || conversation.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-600">
            Start a conversation
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-40 pt-6">
            {conversation.messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                      isUser
                        ? "rounded-br-sm bg-neutral-100 text-neutral-900"
                        : "rounded-bl-sm border border-neutral-800 bg-neutral-900 text-neutral-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              );
            })}

            {agentEvents.length > 0 && (
              <div className="flex justify-start">
                <div className="w-full max-w-[80%] rounded-2xl rounded-bl-sm border border-neutral-800 bg-neutral-900 px-4 py-3">
                  <AgentActivity events={agentEvents} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={onSendMessage} />
    </div>
  );
}

export default WorkspaceView;
