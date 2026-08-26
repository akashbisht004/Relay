import type { Conversation, CreateWorkspace, Workspace } from "./workspace";

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
    conversationId: string;
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