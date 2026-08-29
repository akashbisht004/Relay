import { useEffect, useState } from "react";
import type { Workspace } from "../types/workspace";
import type { Conversation } from "../types/conversation";
import type { ServerMessage, ClientMessage } from "../types/websocket";

type Subscribe = (handler: (message: ServerMessage) => void) => () => void;

type UseWorkspaceProps = {
  subscribe: Subscribe;
  sendMessage: (message: ClientMessage) => void;
  clearAgentEvents: () => void;
  setConversation: (conversation: Conversation | null) => void;
};

export function useWorkspace({
  subscribe,
  sendMessage,
  clearAgentEvents,
  setConversation,
}: UseWorkspaceProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );

  useEffect(() => {
    return subscribe((message) => {
      switch (message.type) {
        case "workspaces":
          setWorkspaces(message.workspaces);
          break;

        case "workspace_created":
          setWorkspaces((prev) => [...prev, message.workspace]);
          setSelectedWorkspace(message.workspace);
          break;

        case "error":
          console.error("Server error:", message.message);
          break;

        default:
          break;
      }
    });
  }, [subscribe]);

  useEffect(() => {
    if (!selectedWorkspace) {
      setConversation(null);
      return;
    }

    clearAgentEvents();

    sendMessage({
      type: "get_conversation",
      conversationId: selectedWorkspace.conversationId,
    });
  }, [selectedWorkspace, clearAgentEvents, sendMessage, setConversation]);

  return {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
  };
}
