import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { Tool } from "./types";

async function searchDirectory(
    directory: string,
    searchText: string,
    results: {
        path: string;
        line: number;
        content: string;
    }[],
) {
    const entries = await readdir(directory, {
        withFileTypes: true,
    });

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            if (
                entry.name === "node_modules" ||
                entry.name === ".git" ||
                entry.name === "dist"
            ) {
                continue;
            }

            await searchDirectory(fullPath, searchText, results);
            continue;
        }

        try {
            const content = await readFile(fullPath, "utf8");
            const lines = content.split("\n");

            lines.forEach((line, index) => {
                if (line.includes(searchText)) {
                    results.push({
                        path: fullPath,
                        line: index + 1,
                        content: line.trim(),
                    });
                }
            });
        } catch {
            
        }
    }
}

export const searchFilesTool: Tool = {
    name: "search_files",
    description: "Searches files recursively for a piece of text",

    execute: async ({
        path: directory,
        searchText,
    }: {
        path: string;
        searchText: string;
    }) => {
        try {
            const results: {
                path: string;
                line: number;
                content: string;
            }[] = [];

            await searchDirectory(directory, searchText, results);

            return {
                success: true,
                path: directory,
                searchText,
                results,
            };
        } catch (error) {
            return {
                success: false,
                path: directory,
                error: String(error),
            };
        }
    },
};