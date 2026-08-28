import "dotenv/config";

import tools from "./tools";
import { getToolDefinitions } from "./tools";
import { geminiModel } from "./model/gemini";

console.log(
    "KEY:",
    process.env.GEMINI_API_KEY ? "FOUND" : "MISSING"
);

async function runAgent(
    userPrompt: string,
    workspacePath: string
) {
    let done = false;

    const toolDefinitions = getToolDefinitions();

    let decision = await geminiModel.generate(
        userPrompt,
        toolDefinitions
    );

    while (!done) {

        console.log("\nMODEL DECISION:");
        console.log(decision);

        if (decision.type === "tool_call") {

            const tool = tools.get(decision.tool);

            if (!tool) {
                throw new Error(
                    `Tool "${decision.tool}" not found`
                );
            }

            const result = await tool.execute(
                decision.args,
                decision.toolCallId,
                workspacePath
            );

            console.log("\nTOOL RESULT:");
            console.log(result);

            decision = await geminiModel.continue(
                result,
                toolDefinitions
            );

            continue;
        }

        if (decision.type === "final") {

            console.log("\nFINAL RESPONSE:");
            console.log(decision.content);

            done = true;
        }
    }
}

void runAgent(
    "Read package.json and tell me what dependencies this project has.",
    "."
);