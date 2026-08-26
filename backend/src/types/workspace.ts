export type CreateWorkspace = {
  name: string;
  path: string;
};

export type Workspace = {
  id: string;
  name: string;
  path: string;
  conversationId: string;
};

export type Conversation = {
  id: string;
  messages: Message[];
};

export type Message = {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

