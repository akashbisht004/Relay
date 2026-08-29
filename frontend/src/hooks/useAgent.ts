import { useEffect, useState } from "react";
import type { AgentEvent } from "../types/agent";
import type { Conversation } from "../types/conversation";
import type { ServerMessage } from "../types/websocket";

export function useAgent(lastMessage: ServerMessage | null) {
  
  const [conversation, setConversation] = useState<Conversation | null>(null);

  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>([]);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case "conversation":
        setConversation(lastMessage.conversation);
        break;

      case "agent_tool_start":
        setAgentEvents((prev) => [
          ...prev,
          {
            type: "tool_start",
            tool: lastMessage.tool,
            toolCallId: lastMessage.toolCallId,
            args: lastMessage.args,
          },
        ]);
        break;

      case "agent_tool_result":
        setAgentEvents((prev) => [
          ...prev,
          {
            type: "tool_result",
            tool: lastMessage.tool,
            toolCallId: lastMessage.toolCallId,
            success: lastMessage.success,
            data: lastMessage.data,
            error: lastMessage.error,
          },
        ]);
        break;

      case "agent_final":
        setConversation((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: lastMessage.content,
                createdAt: new Date(),
              },
            ],
          };
        });

        setAgentEvents([]);
        break;

      default:
        break;
    }
  }, [lastMessage]);

  const addUserMessage = (content: string) => {
    setConversation((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: crypto.randomUUID(),
            role: "user",
            content,
            createdAt: new Date(),
          },
        ],
      };
    });
  };

  const clearAgentEvents = () => {
    setAgentEvents([]);
  };

  return {
    conversation,
    setConversation,
    agentEvents,
    addUserMessage,
    clearAgentEvents,
  };
}