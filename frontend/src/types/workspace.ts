
export type Workspace = {
  id: string;
  name: string;
  path: string;
  conversationId: string;
};

export type CreateWorkspace={
  name: string;
  path: string;
};

export type ModelSelection = {
    provider: "gemini" | "claude" | "openai";
    model: string;
  };