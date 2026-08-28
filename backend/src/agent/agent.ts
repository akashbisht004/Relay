import "dotenv/config";

import tools from "./tools";
import { getToolDefinitions } from "./tools";
import { geminiModel } from "./model/gemini";
import { AgentEvent } from "./types";

export async function runAgent(
    userPrompt: string,
    workspacePath: string,
    onEvent?: (event: AgentEvent) => void
): Promise<void> {

    const toolDefinitions = getToolDefinitions();
    let decision = await geminiModel.generate(userPrompt, toolDefinitions);

    while (true) {

        if (decision.type === "tool_call") {

            const tool = tools.get(decision.tool);
            if (!tool) {
                throw new Error(`Tool "${decision.tool}" not found`);
            }

            // socket event
            onEvent?.({
                type: "tool_start",
                tool: decision.tool,
                toolCallId: decision.toolCallId,
                args: decision.args,
            });

            const result = await tool.execute(
                decision.args,
                decision.toolCallId,
                workspacePath
            );

            // scoket
            onEvent?.({
                type: "tool_result",
                result,
            });

            decision = await geminiModel.continue(
                result,
                toolDefinitions
            );
            continue;
        }

        if (decision.type === "final") {
            // socket event
            onEvent?.({
                type: "final",
                content: decision.content,
            });
            return;
        }
    }
}