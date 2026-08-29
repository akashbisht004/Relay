import { useEffect, useState } from "react";
import type { Workspace } from "../types/workspace";
import type { ServerMessage, ClientMessage } from "../types/websocket";

type UseWorkspaceProps = {
  lastMessage: ServerMessage | null;
  sendMessage: (message: ClientMessage) => void;
  clearAgentEvents: () => void;
  setConversation: (
    conversation: import("../types/conversation").Conversation | null
  ) => void;
};

export function useWorkspace({
  lastMessage,
  sendMessage,
  clearAgentEvents,
  setConversation,
}: UseWorkspaceProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case "workspaces":
        setWorkspaces(lastMessage.workspaces);
        break;

      case "workspace_created":
        setWorkspaces((prev) => [
          ...prev,
          lastMessage.workspace,
        ]);

        setSelectedWorkspace(lastMessage.workspace);
        break;

      case "error":
        console.error("Server error:", lastMessage.message);
        break;

      default:
        break;
    }
  }, [lastMessage]);


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
  }, [selectedWorkspace]);


  const getAllWorkspaces = () => {
    const message: ClientMessage = {
      type: "get_workspaces",
    };

    sendMessage(message);
  };

  return {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    getAllWorkspaces,
  };
}