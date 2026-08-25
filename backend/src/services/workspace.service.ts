import { WorkspaceModel } from "../db/model";
import { CreateWorkspace, Workspace } from "../types/workspace";

export async function createWorkspace(data: CreateWorkspace): Promise<Workspace> {
    const workspace = await WorkspaceModel.create({
        name: data.name,
        path: data.path
    })
    return {
        id: workspace.id,
        name: workspace.name,
        path: workspace.path,
        conversations: workspace.conversations.map((id) => id.toString())
    };
}

export async function getAllWorkspace(): Promise<Workspace[]> {
    const workspaces = await WorkspaceModel.find();

    return workspaces.map((workspace) => ({
        id: workspace.id,
            name: workspace.name,
                path: workspace.path,
                    conversations: workspace.conversations.map((id) => id.toString())
    }));
}