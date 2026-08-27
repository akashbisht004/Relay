import type { AgentMessage, Decision } from "../types";

export type Model = {
    generate: (context: AgentMessage[]) => Promise<Decision>;
};