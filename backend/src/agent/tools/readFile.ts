import { readFile } from "node:fs/promises";
import type { Tool } from "./types";

export const readFileTool: Tool={
    name: "read_file",
    description: "reads content of a file",
    execute: async ({path}:{path: string})=>{
        const content=await readFile(path, 'utf-8');
        return {
            success: true,
            path,
            content
        }
    }
};