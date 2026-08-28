import type { ToolResult } from "../types";

export type Tool = {
    name: string;
    description: string;
    parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required?: string[];
    };

    execute: (
        args: any,
        toolCallId: string,
        workspacePath: string
    ) => Promise<ToolResult>;
};

export type ToolDefinition = {
    name: string;
    description: string;

    parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
    };
};