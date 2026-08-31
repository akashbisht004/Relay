import "dotenv/config";

import tools from "./tools";
import { getToolDefinitions } from "./tools";
import type { AgentEvent, Decision, ToolResult } from "./types";
import type { ModelSession, ModelProvider } from "./model/types";
import { models } from "./model/index";

const MAX_STEPS = 25;

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

    try {
        let decision: Decision = await sdk.generate(userPrompt, toolDefinitions, model, session);
        let steps = 0;

        while (true) {
            switch (decision.type) {
                case "tool_call": {
                    if (++steps > MAX_STEPS) {
                        onEvent?.({
                            type: "error",
                            message: `Stopped: exceeded ${MAX_STEPS} steps`,
                        });
                        return;
                    }

                    const tool = tools.get(decision.tool);

                    // socket event
                    onEvent?.({
                        type: "tool_start",
                        tool: decision.tool,
                        toolCallId: decision.toolCallId,
                        args: decision.args,
                    });

                    let result: ToolResult;
                    if (!tool) {
                        result = {
                            success: false,
                            toolCallId: decision.toolCallId,
                            tool: decision.tool,
                            error: `Tool "${decision.tool}" not found`,
                        };
                    } else {
                        try {
                            result = await tool.execute(
                                decision.args,
                                decision.toolCallId,
                                workspacePath
                            );
                        } catch (err) {
                            result = {
                                success: false,
                                toolCallId: decision.toolCallId,
                                tool: decision.tool,
                                error: err instanceof Error ? err.message : String(err),
                            };
                        }
                    }

                    // socket
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
                    break;
                }

                case "final": {
                    // socket event
                    onEvent?.({
                        type: "final",
                        content: decision.content,
                    });
                    return;
                }

                default: {
                    throw new Error(`Unknown decision type: ${(decision as any).type}`);
                }
            }
        }
    } catch (err) {
        onEvent?.({
            type: "error",
            message: err instanceof Error ? err.message : String(err),
        });
    }
}