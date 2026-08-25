export type CreateWorkspace = {
  name: string;
  path: string;
};

export type Workspace = {
  id: string;
  name: string;
  path: string;
  conversations: string[];
};

export type Conversation = {
  id: string;
  messages: Message[];
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

