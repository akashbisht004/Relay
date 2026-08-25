import type { Conversation } from "./conversation";

export type Workspace = {
  id: string;
  name: string;
  path: string;
  conversations: Conversation[];
};

export type CreateWorkspace={
  name: string;
  path: string;
}