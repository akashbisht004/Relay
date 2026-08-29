import "dotenv/config";

import Anthropic from "@anthropic-ai/sdk";

import type { Decision, ToolResult } from "../types";
import type { ToolDefinition } from "../tools/types";
import type { Model, ModelSession } from "./types";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

function toClaudeTools(tools: ToolDefinition[]) {
    return tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.parameters as any,
    }));
}

async function callClaude(
    tools: ToolDefinition[],
    model: string,
    session: ModelSession
): Promise<Decision> {

    const response = await anthropic.messages.create({
        model,
        max_tokens: 16000,
        system: `
            You are an AI coding agent.
            You can inspect and modify software projects using the available tools.
            Use tools whenever necessary to complete the user's task.
            When the task is complete, provide a final response.
        `,
        tools: toClaudeTools(tools),
        messages: session.history as any[],
    });

    /*
     * IMPORTANT:
     * Store the complete assistant response.
     *
     * Claude's tool_use block is part of the assistant message
     * and must be preserved for the following tool_result.
     */
    session.history.push({
        role: "assistant",
        content: response.content,
    });

    const toolUse = response.content.find(
        (block) => block.type === "tool_use"
    );

    if (toolUse && toolUse.type === "tool_use") {

        return {
            type: "tool_call",
            toolCallId: toolUse.id,
            tool: toolUse.name,
            args: toolUse.input as Record<string, unknown>,
        };
    }

    const textBlock = response.content.find(
        (block) => block.type === "text"
    );

    return {
        type: "final",
        content: textBlock?.type === "text"
            ? textBlock.text
            : "",
    };
}

export const claudeModel: Model = {

    generate: async (
        userPrompt,
        tools,
        model,
        session
    ) => {
        console.log("working")
        session.history.push({
            role: "user",
            content: userPrompt,
        });

        return callClaude(
            tools,
            model,
            session
        );
    },

    continue: async (
        toolResult: ToolResult,
        tools,
        model,
        session
    ) => {

        session.history.push({
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: toolResult.toolCallId,
                    content: JSON.stringify(toolResult),
                },
            ],
        });

        return callClaude(
            tools,
            model,
            session
        );
    },
};