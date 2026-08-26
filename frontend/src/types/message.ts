export type MessageRole =
  | "user"
  | "assistant"
  | "system"
  | "agent";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
};
