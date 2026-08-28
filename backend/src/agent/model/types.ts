import type { Decision } from "../types";
import type { ToolDefinition } from "../tools/types";
import type { ToolResult } from "../types";

export type Model = {
    generate: (
        userPrompt: string,
        tools: ToolDefinition[],
    ) => Promise<Decision>;

    continue: (
        toolResult: ToolResult,
        tools: ToolDefinition[],
    ) => Promise<Decision>;
};