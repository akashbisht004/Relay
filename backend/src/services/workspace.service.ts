import { ConversationModel, WorkspaceModel } from "../db/model";
import type { CreateWorkspace, Workspace, Message, Conversation } from "../types/workspace";
import { runAgent } from "../agent/agent";
import { ServerMessage } from "../types/websocket";
import { ModelProvider } from "../agent/model/types";

export async function createWorkspace(data: CreateWorkspace): Promise<Workspace> {
    const conversation = await ConversationModel.create({ messages: [] })

    const workspace = await WorkspaceModel.create({
        name: data.name,
        path: data.path,
        conversationId: conversation._id
    })

    return {
        id: workspace.id,
        name: workspace.name,
        path: workspace.path,
        conversationId: workspace.conversationId.toString()
    };
}

export async function getAllWorkspace(): Promise<Workspace[]> {
    const workspaces = await WorkspaceModel.find();

    return workspaces.map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        path: workspace.path,
        conversationId: workspace.conversationId?.toString()
    }));
}

export async function getConversation(conversationId: string): Promise<Conversation> {
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) throw new Error("Conversation not found");
    return conversation;
}

export async function handleChatMessage(workspaceId: string, userMessage: string, provider: ModelProvider, model: string, send: (message: ServerMessage) => void) {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        throw new Error("Workspace not found");
    }

    const conversation = await ConversationModel.findById(workspace.conversationId);
    if (!conversation) {
        throw new Error("Conversation not found");
    }

    const message: Message = {
        role: "user",
        content: userMessage,
        createdAt: new Date
    }
    conversation.messages.push(message);
    await conversation.save();

    await runAgent(userMessage, workspace.path,
        provider, model,
        (event) => {
            if (event.type === "tool_start") {
                send({
                    type: "agent_tool_start",
                    tool: event.tool,
                    toolCallId: event.toolCallId,
                    args: event.args,
                });
                return;
            }

            if (event.type === "tool_result") {
                send({
                    type: "agent_tool_result",
                    tool: event.result.tool,
                    toolCallId: event.result.toolCallId,
                    success: event.result.success,
                    data: event.result.data,
                    error: event.result.error,
                });
                return;
            }

            if (event.type === "final") {
                send({
                    type: "agent_final",
                    content: event.content,
                });
                conversation.messages.push({
                    role: "assistant",
                    content: event.content,
                    createdAt: new Date(),
                });
                return;
            }
        }
    );
    await conversation.save();
}