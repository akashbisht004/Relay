import "dotenv/config";

import tools from "./tools";
import { getToolDefinitions } from "./tools";
import type { AgentEvent } from "./types";
import type { ModelSession, ModelProvider } from "./model/types";
import { models } from "./model/index";


export async function runAgent(
    userPrompt: string,
    workspacePath: string,
    provider: ModelProvider,
    model: string,
    onEvent?: (event: AgentEvent) => void,
): Promise<void> {

    const toolDefinitions = getToolDefinitions();
    const session: ModelSession = {
        history: []
    }

    const sdk = models[provider];
    if (!sdk) {
        throw new Error(`Unsupported model provider: ${provider}`);
    }

    let decision = await sdk.generate(userPrompt, toolDefinitions, model, session);

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

            decision = await sdk.continue(
                result,
                toolDefinitions,
                model,
                session
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