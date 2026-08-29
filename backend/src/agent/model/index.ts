import type { Model, ModelProvider } from "./types";

import { geminiModel } from "./gemini";
import { claudeModel } from "./claude";
import { openaiModel } from "./openai";

export const models: Record<ModelProvider, Model> = {
    gemini: geminiModel,
    claude: claudeModel,
    openai: openaiModel,
};