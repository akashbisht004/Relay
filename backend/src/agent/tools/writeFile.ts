import { writeFile } from "node:fs/promises";
import type { Tool } from "./types";

export const writeFileTool: Tool = {
    name: "write_file",
    description: "writes content in file",
    execute: async ({ path, content }: { path: string, content: string }) => {
        await writeFile(path, content);
        return {
            success: true,
            path
        }
    }
};