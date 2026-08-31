import {
    readdir,
    readFile,
} from "node:fs/promises";

import path from "node:path";

import type { Tool } from "./types";
import { resolveWorkspacePath } from "../utility";
import type { ToolResult } from "../types";

async function searchDirectory(
    directory: string,
    searchText: string,
    results: string[],
    workspacePath: string
): Promise<void> {

    const entries = await readdir(
        directory,
        {
            withFileTypes: true,
        }
    );

    for (const entry of entries) {

        const fullPath = path.join(
            directory,
            entry.name
        );

        if (entry.isDirectory()) {

            // Don't search dependencies/build output
            if (
                entry.name === "node_modules" ||
                entry.name === ".git" ||
                entry.name === "dist"
            ) {
                continue;
            }

            await searchDirectory(
                fullPath,
                searchText,
                results,
                workspacePath
            );

            continue;
        }

        try {

            const content = await readFile(
                fullPath,
                "utf-8"
            );

            if (content.includes(searchText)) {

                results.push(
                    path.relative(
                        workspacePath,
                        fullPath
                    )
                );
            }

        } catch {
            // Ignore files that cannot be read as text
        }
    }
}

export const searchFilesTool: Tool = {

    name: "search_files",

    description:
        "Searches files inside the workspace for a text string.",

    parameters: {
        type: "object",

        properties: {

            query: {
                type: "string",
                description:
                    "Text to search for.",
            },

            path: {
                type: "string",
                description:
                    "Directory to search from. Use '.' for the workspace root.",
            },
        },

        required: [
            "query",
            "path",
        ],
    },

    execute: async (
        args,
        toolCallId,
        workspacePath
    ): Promise<ToolResult> => {

        if (
            typeof args.query !== "string" ||
            typeof args.path !== "string"
        ) {
            return {
                success: false,
                toolCallId,
                tool: "search_files",
                error:
                    "query and path must be strings",
            };
        }

        try {

            const searchPath = resolveWorkspacePath(
                workspacePath,
                args.path
            );

            const results: string[] = [];

            await searchDirectory(
                searchPath,
                args.query,
                results,
                workspacePath
            );

            return {
                success: true,
                toolCallId,
                tool: "search_files",
                data: results,
            };

        } catch (error) {

            return {
                success: false,
                toolCallId,
                tool: "search_files",
                error: error instanceof Error
                    ? error.message
                    : "Failed to search files",
            };
        }
    },
};