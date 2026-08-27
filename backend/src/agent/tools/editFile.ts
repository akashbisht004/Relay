import { readFile, writeFile } from "node:fs/promises";
import type { Tool } from "./types";

export const editFileTool: Tool = {
    name: "edit_file",
    description: "Edits part of a file",

    execute: async ({
        path,
        oldText,
        newText,
    }: {
        path: string;
        oldText: string;
        newText: string;
    }) => {
        try {
            const data = await readFile(path, "utf8");
            if (!data.includes(oldText)) {
                return {
                    success: false,
                    path,
                    error: "oldText was not found in the file",
                };
            }

            const modifiedData = data.replace(oldText, newText);
            await writeFile(path, modifiedData, "utf8");
            return {
                success: true,
                path,
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