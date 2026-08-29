import type { Decision } from "../types";
import type { ToolDefinition } from "../tools/types";
import type { ToolResult } from "../types";

export type ModelSession = {
    history: unknown[];
};

export type ModelProvider =
    | "gemini"
    | "claude"
    | "openai";

export type ModelConfig = {
    provider: ModelProvider;
    model: string;
};

export type Model = {
    generate: (
        userPrompt: string,
        tools: ToolDefinition[],
        model: string,
        session: ModelSession
    ) => Promise<Decision>;

    continue: (
        toolResult: ToolResult,
        tools: ToolDefinition[],
        model: string,
        session: ModelSession
    ) => Promise<Decision>;
};

