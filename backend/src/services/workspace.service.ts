import { ConversationModel, WorkspaceModel } from "../db/model";
import type { CreateWorkspace, Workspace, Message, Conversation } from "../types/workspace";

export async function createWorkspace(data: CreateWorkspace): Promise<Workspace> {
    const conversation= await ConversationModel.create({messages:[]})

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

export async function getConversation(conversationId: string): Promise<Conversation>{
    const conversation=await ConversationModel.findById(conversationId);
    if(!conversation) throw new Error("Conversation not found");
    return conversation;
}

export async function handleChatMessage(workspaceId: string, userMessage: string) {
    const workspace = await WorkspaceModel.findById(workspaceId);
    const conversation = await ConversationModel.findById(workspace?.conversationId);

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

    // ai fuction calling agent
}