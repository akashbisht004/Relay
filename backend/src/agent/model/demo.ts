import type { AgentMessage, Decision } from "../types";
import type { Model } from "./types";

export const demo: Model = {
    generate: async (context: AgentMessage[]): Promise<Decision> => {
        const lastMessage = context[context.length - 1];

        if (lastMessage?.role === "user") {
            return {
                type: "tool_call",
                tool: "list_directory",
                args: {
                    path: ".",
                },
            };
        }

        if (lastMessage?.role === "tool" && lastMessage.tool === "list_directory") {
            return {
                type: "tool_call",
                tool: "read_file",
                args: {
                    path: "package.json",
                },
            };
        }

        return {
            type: "final",
            content: "I inspected the project and read package.json.",
        };
    },
};