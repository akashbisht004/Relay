import { readdir } from "node:fs/promises";

import type { Tool } from "./types";
import { resolveWorkspacePath } from "../utility";
import type { ToolResult } from "../types";

export const listDirectoryTool: Tool = {

    name: "list_directory",

    description:
        "Lists files and directories inside a workspace directory.",

    parameters: {
        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Relative directory path. Use '.' for workspace root.",
            },
        },

        required: ["path"],
    },

    execute: async (
        args,
        toolCallId,
        workspacePath
    ): Promise<ToolResult> => {

        if (typeof args.path !== "string") {
            return {
                success: false,
                toolCallId,
                tool: "list_directory",
                error: "path must be a string",
            };
        }

        try {

            const directoryPath = resolveWorkspacePath(
                workspacePath,
                args.path
            );

            const entries = await readdir(
                directoryPath,
                {
                    withFileTypes: true,
                }
            );

            const result = entries.map((entry) => ({
                name: entry.name,
                type: entry.isDirectory()
                    ? "directory"
                    : "file",
            }));

            return {
                success: true,
                toolCallId,
                tool: "list_directory",
                data: result,
            };

        } catch (error) {

            return {
                success: false,
                toolCallId,
                tool: "list_directory",
                error: error instanceof Error
                    ? error.message
                    : "Failed to list directory",
            };
        }
    },
};