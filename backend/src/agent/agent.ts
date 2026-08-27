import tools from "./tools";
import type { AgentMessage } from "./types";
import { demo } from "./model/demo";

const context: AgentMessage[] = [];
context.push({
    role: "user",
    content: "Inspect the project and read package.json",
});

async function runAgent() {
    let done = false;

    while (!done) {
        const decision = await demo.generate(context);

        console.log("DECISION:", decision);
        if (decision.type === "tool_call") {
            const tool = tools.get(decision.tool);

            if (!tool) {
                const error = {
                    success: false,
                    error: `Tool "${decision.tool}" not found`,
                };
                context.push({
                    role: "tool",
                    tool: decision.tool,
                    content: error,
                });
                continue;
            }

            context.push({
                role: "assistant",
                tool: decision.tool,
                args: decision.args,
            });

            const result = await tool.execute(decision.args);
            console.log("TOOL RESULT:", result);

            context.push({
                role: "tool",
                tool: decision.tool,
                content: result,
            });
        }

        if (decision.type === "final") {
            console.log("FINAL:", decision.content);
            done = true;
        }
    }
}
void runAgent();