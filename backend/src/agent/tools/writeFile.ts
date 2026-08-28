import { writeFile } from "node:fs/promises";

import type { Tool } from "./types";
import { resolveWorkspacePath } from "../workspace";
import type { ToolResult } from "../types";

export const writeFileTool: Tool = {

    name: "write_file",

    description:
        "Writes complete content to a file inside the workspace.",

    parameters: {
        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Relative path of the file to write.",
            },

            content: {
                type: "string",
                description:
                    "Complete content that should be written to the file.",
            },
        },

        required: ["path", "content"],
    },

    execute: async (
        args,
        toolCallId,
        workspacePath
    ): Promise<ToolResult> => {

        if (
            typeof args.path !== "string" ||
            typeof args.content !== "string"
        ) {
            return {
                success: false,
                toolCallId,
                tool: "write_file",
                error:
                    "path and content must be strings",
            };
        }

        try {

            const filePath = resolveWorkspacePath(
                workspacePath,
                args.path
            );

            await writeFile(
                filePath,
                args.content,
                "utf-8"
            );

            return {
                success: true,
                toolCallId,
                tool: "write_file",
                data: `Successfully wrote ${args.path}`,
            };

        } catch (error) {

            return {
                success: false,
                toolCallId,
                tool: "write_file",
                error: error instanceof Error
                    ? error.message
                    : "Failed to write file",
            };
        }
    },
};