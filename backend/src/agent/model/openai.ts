import "dotenv/config";

import OpenAI from "openai";

import type { Decision, ToolResult } from "../types";
import type { ToolDefinition } from "../tools/types";
import type { Model, ModelSession } from "./types";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function toOpenAITools(tools: ToolDefinition[]) {
    return tools.map((tool) => ({
        type: "function" as const,
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters as any,
        strict: false,
    }));
}

async function callOpenAI(
    tools: ToolDefinition[],
    model: string,
    session: ModelSession
): Promise<Decision> {

    const response = await openai.responses.create({
        model,
        instructions: `
            You are an AI coding agent.
            You can inspect and modify software projects using the available tools.
            Use tools whenever necessary to complete the user's task.
            When the task is complete, provide a final response.
        `,
        input: session.history as any[],
        tools: toOpenAITools(tools),
    });

    /*
     * Save the complete response output.
     *
     * This preserves the model's function call so that
     * the next request can contain the corresponding
     * function output.
     */
    session.history.push(
        ...response.output
    );

    const functionCall = response.output.find(
        (item) => item.type === "function_call"
    );

    if (functionCall && functionCall.type === "function_call") {

        return {
            type: "tool_call",
            toolCallId: functionCall.call_id,
            tool: functionCall.name,
            args: JSON.parse(functionCall.arguments),
        };
    }

    return {
        type: "final",
        content: response.output_text ?? "",
    };
}

export const openaiModel: Model = {

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

        return callOpenAI(
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
            type: "function_call_output",
            call_id: toolResult.toolCallId,
            output: JSON.stringify(toolResult),
        });

        return callOpenAI(
            tools,
            model,
            session
        );
    },
};