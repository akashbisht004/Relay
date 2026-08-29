export type AgentEvent =
  | {
    type: "tool_start";
    tool: string;
    toolCallId: string;
    args: Record<string, unknown>;
  }
  | {
    type: "tool_result";
    tool: string;
    toolCallId: string;
    success: boolean;
    data?: unknown;
    error?: string;
  };

export type ModelProvider =
  | "gemini"
  | "claude"
  | "openai";
