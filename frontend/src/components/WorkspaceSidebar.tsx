import type { Workspace } from "../types/workspace";
import { useState } from "react";
import WorkspaceForm from "./WorkspaceForm";
import type { ClientMessage } from "../types/websocket";

type WorkspaceSidebarProps = {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace) => void;
  sendMessage: (message: ClientMessage)=>void;
};

function WorkspaceSidebar({
  workspaces,
  selectedWorkspace,
  setSelectedWorkspace,
  sendMessage
}: WorkspaceSidebarProps) {
    
  const [newWorkspace, setNewWorkspace] = useState(false);
  return (
    <div className="min-h-screen w-1/4 min-w-40 max-w-3xs rounded-xl border-2 border-zinc-800 bg-zinc-200 p-2">

      <div className="flex flex-row justify-between border p-1">
        <div>Workspaces</div>

        <button
          type="button"
          className="cursor-pointer border px-2"
          onClick={() => setNewWorkspace((prev) => !prev)}
          title="Add new workspace"
        >
          +
        </button>
      </div>

      {newWorkspace && (
        <WorkspaceForm
          setNewWorkspace={setNewWorkspace}
          sendMessage={sendMessage}
        />
      )}

      <div className="mt-2 h-3/4 border border-gray-600 p-5">
        {workspaces.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            Add new workspace
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {workspaces.map((workspace) => (
              <button
                type="button"
                key={workspace.id}
                className={`cursor-pointer border border-gray-500 p-1 text-center ${
                  selectedWorkspace?.id === workspace.id ? "bg-gray-400" : ""
                }`}
                onClick={() => setSelectedWorkspace(workspace)}
              >
                {workspace.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspaceSidebar;
