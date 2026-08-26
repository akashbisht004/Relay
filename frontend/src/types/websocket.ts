import type { CreateWorkspace, Workspace } from "./workspace";
import type { Conversation } from "./conversation";

export type ClientMessage =
  | {
    type: "create_workspace";
    workspaceDetails: CreateWorkspace;
  }
  | {
    type: "get_workspaces";
  }
  | {
    type: "chat_message";
    workspaceId: string;
    message: string;
  }
  | {
    type: "get_conversation";
    conversationId: string;
  };

export type ServerMessage =
  | {
    type: "workspace_created";
    workspace: Workspace;
  }
  | {
    type: "workspaces";
    workspaces: Workspace[];
  }
  | {
    type: "error";
    message: string;
  }
  | {
    type: "conversation";
    conversation: Conversation;
  };