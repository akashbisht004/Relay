import type { Message } from "./message";

export type Conversation = {
  id: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};
