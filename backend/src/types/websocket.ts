import { ModelProvider } from "../agent/model/types";
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
    provider: ModelProvider;
    model: string;
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
    type: "conversation";
    conversation: Conversation;
  }
  | {
    type: "agent_tool_start";
    tool: string;
    toolCallId: string;
    args: Record<string, unknown>;
  }
  | {
    type: "agent_tool_result";
    tool: string;
    toolCallId: string;
    success: boolean;
    data?: unknown;
    error?: string;
  }
  | {
    type: "agent_final";
    content: string;
  }
  | {
    type: "error";
    message: string;
  };