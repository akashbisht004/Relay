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
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [conversation?.messages.length, agentEvents.length]);

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border-2 border-zinc-800 bg-zinc-200">
      {selectedWorkspace && (
        <div className="shrink-0 border-b border-zinc-300 bg-zinc-200 px-5 py-4">
          <div className="flex items-center gap-5">
            <h2 className="text-xl font-bold">{selectedWorkspace.name}</h2>

            <p className="text-sm text-gray-600">
              Path: {selectedWorkspace.path}
            </p>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!selectedWorkspace ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a workspace
          </div>
        ) : !conversation || conversation.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Start a conversation...
          </div>
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col gap-5 px-6 pb-32 pt-6">
            {conversation.messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      isUser
                        ? "rounded-br-md bg-zinc-800 text-white"
                        : "rounded-bl-md bg-white text-zinc-900 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {message.content}
                    </p>
                  </div>
                </div>
              );
            })}

            {agentEvents.length > 0 && (
              <div className="flex justify-start">
                <div className="w-full max-w-[75%] rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
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
