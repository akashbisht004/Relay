import "dotenv/config";

import { GoogleGenAI } from "@google/genai";

import type { Decision } from "../types";
import type { ToolDefinition } from "../tools/types";
import type { Model, ModelSession } from "./types";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

function toGeminiTools(tools: ToolDefinition[]) {
    return tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters as any,
    }));
}

async function callGemini(
    tools: ToolDefinition[],
    model: string,
    session: ModelSession
): Promise<Decision> {

    const response = await ai.models.generateContent({
        model,
        contents: session.history as any[],
        config: {
            systemInstruction: `
                You are an AI coding agent.
                You can inspect and modify software projects using the available tools.
                Use tools whenever necessary to complete the user's task.
                When the task is complete, provide a final response.
            `,
            tools: [
                {
                    functionDeclarations: toGeminiTools(tools),
                },
            ],
        },
    });

    const modelContent = response.candidates?.[0]?.content;

    if (!modelContent) {
        throw new Error("Gemini returned no content");
    }

    session.history.push(modelContent);

    const functionCall = response.functionCalls?.[0];

    if (functionCall) {

        if (!functionCall.name) {
            throw new Error(
                "Gemini returned a function call without a name"
            );
        }

        return {
            type: "tool_call",
            toolCallId: functionCall.id ?? crypto.randomUUID(),
            tool: functionCall.name,
            args: functionCall.args ?? {},
        };
    }

    return {
        type: "final",
        content: response.text ?? "",
    };
}

export const geminiModel: Model = {

    generate: async (
        userPrompt,
        tools,
        model,
        session
    ) => {

        session.history.push({
            role: "user",
            parts: [
                {
                    text: userPrompt,
                },
            ],
        });

        return callGemini(tools, model, session);
    },

    continue: async (
        toolResult,
        tools,
        model,
        session
    ) => {

        session.history.push({
            role: "user",
            parts: [
                {
                    functionResponse: {
                        name: toolResult.tool,
                        id: toolResult.toolCallId,
                        response: {
                            result: toolResult,
                        },
                    },
                },
            ],
        });

        return callGemini(tools, model, session);
    },
};