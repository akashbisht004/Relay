import type { CreateWorkspace, Workspace } from "./workspace";

export type ClientMessage =
  | {
      type: "create_workspace";
      workspaceDetails: CreateWorkspace;
    }
  | {
      type: "get_workspaces";
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