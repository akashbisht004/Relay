import { readFile, writeFile } from "node:fs/promises";

import type { Tool } from "./types";
import { resolveWorkspacePath } from "../utility";
import type { ToolResult } from "../types";

export const editFileTool: Tool = {

    name: "edit_file",

    description:
        "Replaces specific existing text in a file inside the workspace.",

    parameters: {
        type: "object",

        properties: {

            path: {
                type: "string",
                description:
                    "Relative path of the file to edit.",
            },

            oldText: {
                type: "string",
                description:
                    "Exact text that should be replaced.",
            },

            newText: {
                type: "string",
                description:
                    "New text that should replace the old text.",
            },
        },

        required: [
            "path",
            "oldText",
            "newText",
        ],
    },

    execute: async (
        args,
        toolCallId,
        workspacePath
    ): Promise<ToolResult> => {

        if (
            typeof args.path !== "string" ||
            typeof args.oldText !== "string" ||
            typeof args.newText !== "string"
        ) {
            return {
                success: false,
                toolCallId,
                tool: "edit_file",
                error:
                    "path, oldText and newText must be strings",
            };
        }

        try {

            const filePath = resolveWorkspacePath(
                workspacePath,
                args.path
            );

            const content = await readFile(
                filePath,
                "utf-8"
            );

            if (!content.includes(args.oldText)) {
                return {
                    success: false,
                    toolCallId,
                    tool: "edit_file",
                    error:
                        "oldText was not found in the file",
                };
            }

            const modifiedContent = content.replace(
                args.oldText,
                args.newText
            );

            await writeFile(
                filePath,
                modifiedContent,
                "utf-8"
            );

            return {
                success: true,
                toolCallId,
                tool: "edit_file",
                data:
                    `Successfully edited ${args.path}`,
            };

        } catch (error) {

            return {
                success: false,
                toolCallId,
                tool: "edit_file",
                error: error instanceof Error
                    ? error.message
                    : "Failed to edit file",
            };
        }
    },
};