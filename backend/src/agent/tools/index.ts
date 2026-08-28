import { editFileTool } from "./editFile";
import { listDirectoryTool } from "./listDirectory";
import { readFileTool } from "./readFile";
import { searchFilesTool } from "./serachFiles";
import type { Tool, ToolDefinition } from "./types";
import { writeFileTool } from "./writeFile";

export const tools = new Map([
    [readFileTool.name, readFileTool],
    [writeFileTool.name, writeFileTool],
    [editFileTool.name, editFileTool],
    [listDirectoryTool.name, listDirectoryTool],
    [searchFilesTool.name, searchFilesTool],
]);

export default tools;

export function getToolDefinitions(): ToolDefinition[] {
    return Array.from(tools.values()).map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: {
            ...tool.parameters,
            required: tool.parameters.required ?? []
        }
    }))
}

