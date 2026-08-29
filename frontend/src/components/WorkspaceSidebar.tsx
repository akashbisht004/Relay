import type { Workspace } from "../types/workspace";
import { useState } from "react";
import WorkspaceForm from "./WorkspaceForm";
import type { ClientMessage } from "../types/websocket";

type WorkspaceSidebarProps = {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace) => void;
  sendMessage: (message: ClientMessage) => void;
};

function WorkspaceSidebar({
  workspaces,
  selectedWorkspace,
  setSelectedWorkspace,
  sendMessage,
}: WorkspaceSidebarProps) {
  const [newWorkspace, setNewWorkspace] = useState(false);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950">
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Workspaces
        </span>

        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded-md text-lg leading-none text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
          onClick={() => setNewWorkspace((prev) => !prev)}
          title="Add new workspace"
        >
          +
        </button>
      </div>

      {newWorkspace && (
        <div className="shrink-0 px-3 pb-3">
          <WorkspaceForm
            setNewWorkspace={setNewWorkspace}
            sendMessage={sendMessage}
          />
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {workspaces.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-neutral-600">
            No workspaces yet
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {workspaces.map((workspace) => {
              const isSelected = selectedWorkspace?.id === workspace.id;

              return (
                <button
                  type="button"
                  key={workspace.id}
                  className={`truncate rounded-md px-3 py-2 text-left text-sm transition ${
                    isSelected
                      ? "bg-neutral-800 text-neutral-100"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                  }`}
                  onClick={() => setSelectedWorkspace(workspace)}
                >
                  {workspace.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

export default WorkspaceSidebar;
