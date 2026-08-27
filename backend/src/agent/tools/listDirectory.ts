import { readdir } from "node:fs/promises";

import type { Tool } from "./types";

export const listDirectoryTool: Tool = {
    name: "list_directory",
    description: "Lists files and directories inside a directory",

    execute: async ({ path }: { path: string }) => {
        try {
            const entries = await readdir(path, {
                withFileTypes: true,
            });

            const files = entries.map((entry) => ({
                name: entry.name,
                type: entry.isDirectory() ? "directory" : "file",
            }));

            return {
                success: true,
                path,
                entries: files,
            };
        } catch (error) {
            return {
                success: false,
                path,
                error: String(error),
            };
        }
    },
};