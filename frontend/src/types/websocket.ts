import type { CreateWorkspace, Workspace } from "./workspace";

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
    };