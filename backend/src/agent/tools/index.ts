import { editFileTool } from "./editFile";
import { listDirectoryTool } from "./listDirectory";
import { readFileTool } from "./readFile";
import { searchFilesTool } from "./serachFiles";
import type { Tool } from "./types";
import { writeFileTool } from "./writeFile";

const tools=new Map<string,Tool>();

tools.set(readFileTool.name, readFileTool);
tools.set(writeFileTool.name, writeFileTool);
tools.set(editFileTool.name, editFileTool);
tools.set(listDirectoryTool.name, listDirectoryTool);
tools.set(searchFilesTool.name, searchFilesTool);

export default tools;