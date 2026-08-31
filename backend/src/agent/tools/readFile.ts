import { readFile } from "node:fs/promises";
import type { Tool } from "./types";
import { ToolResult } from "../types";
import { resolveWorkspacePath } from "../utility";

export const readFileTool: Tool = {

    name: "read_file",

    description: "Reads content of a file inside the workspace",

    parameters: {
        type: "object",
        properties: {
            path: {
                type: "string",
                description: "Relative path of the file to read",
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
                tool: "read_file",
                error: "path must be a string",
            };
        }

        const filePath = resolveWorkspacePath(
            workspacePath,
            args.path
        );

        const content = await readFile(
            filePath,
            "utf-8"
        );

        return {
            success: true,
            toolCallId,
            tool: "read_file",
            data: content,
        };
    },
};