export type Decision =
    | {
        type: "tool_call";
        tool: string;
        args: Record<string, unknown>;
    }
    | {
        type: "final";
        content: string;
    };

export type AgentMessage =
    | {
        role: "system";
        content: string;
    }
    | {
        role: "user";
        content: string;
    }
    | {
        role: "assistant";
        content: string;
    }
    | {
        role: "assistant";
        tool: string;
        args: Record<string, unknown>;
    }
    | {
        role: "tool";
        tool: string;
        content: unknown;
    };