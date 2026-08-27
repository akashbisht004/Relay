export type Tool = {
    name: string;
    description: string;
    execute: (args: any) => Promise<any>;
}

export type ToolResult={
    success: boolean,
    path: string,
    content?: string
}