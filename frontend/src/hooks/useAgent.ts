import { useCallback, useEffect, useState } from "react";
import type { AgentEvent } from "../types/agent";
import type { Conversation } from "../types/conversation";
import type { ServerMessage } from "../types/websocket";

type Subscribe = (handler: (message: ServerMessage) => void) => () => void;

export function useAgent(subscribe: Subscribe) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);

  useEffect(() => {
    return subscribe((message) => {
      switch (message.type) {
        case "conversation":
          setConversation(message.conversation);
          setIsProcessing(false);
          break;

        case "agent_tool_start":
          setAgentEvents((prev) => [
            ...prev,
            {
              type: "tool_start",
              tool: message.tool,
              toolCallId: message.toolCallId,
              args: message.args,
            },
          ]);
          break;

        case "agent_tool_result":
          setAgentEvents((prev) => [
            ...prev,
            {
              type: "tool_result",
              tool: message.tool,
              toolCallId: message.toolCallId,
              success: message.success,
              data: message.data,
              error: message.error,
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
                  content: message.content,
                  createdAt: new Date().toISOString(),
                },
              ],
            };
          });

          setAgentEvents([]);
          setIsProcessing(false);
          break;

        case "error":
          setAgentEvents([]);
          setAgentError(message.message);
          setIsProcessing(false);
          break;

        default:
          break;
      }
    });
  }, [subscribe]);

  const addUserMessage = useCallback((content: string) => {
    setIsProcessing(true);
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
            createdAt: new Date().toISOString(),
          },
        ],
      };
    });
  }, []);

  const clearAgentEvents = useCallback(() => {
    setAgentEvents([]);
    setAgentError(null);
  }, []);

  return {
    conversation,
    setConversation,
    agentEvents,
    agentError,
    isProcessing,
    addUserMessage,
    clearAgentEvents,
  };
}
