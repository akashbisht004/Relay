import { useState } from "react";
import type { Conversation } from "../types/conversation";
import type { Message } from "../types/message";

export function useConversation() {
  const [conversation, setConversation] = useState<Conversation | null>(null);

  const setConversationFromServer = (
    conversation: Conversation,
  ) => {
    setConversation(conversation);
  };

  const clearConversation = () => {
    setConversation(null);
  };

  const addUserMessage = (content: string) => {
    const now = new Date();

    const message: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: now,
    };

    setConversation((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        messages: [...prev.messages, message],
        updatedAt: now.toISOString(),
      };
    });
  };

  const addAssistantMessage = (content: string) => {
    const now = new Date();

    const message: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content,
      createdAt: now,
    };

    setConversation((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        messages: [...prev.messages, message],
        updatedAt: now.toISOString(),
      };
    });
  };

  return {
    conversation,
    setConversationFromServer,
    clearConversation,
    addUserMessage,
    addAssistantMessage,
  };
}

