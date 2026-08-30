import type { Workspace } from "../types/workspace";
import { useState } from "react";
import WorkspaceForm from "./WorkspaceForm";
import type { ClientMessage } from "../types/websocket";

type WorkspaceSidebarProps = {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace) => void;
  sendMessage: (message: ClientMessage) => void;
  collapsed: boolean;
  onCollapse: () => void;
};

function WorkspaceSidebar({
  workspaces,
  selectedWorkspace,
  setSelectedWorkspace,
  sendMessage,
  collapsed,
  onCollapse,
}: WorkspaceSidebarProps) {
  const [newWorkspace, setNewWorkspace] = useState(false);

  return (
    <aside
      className={`flex shrink-0 flex-col overflow-hidden border-r border-neutral-800 bg-neutral-950 transition-[width] duration-200 ease-out ${
        collapsed ? "w-0 border-r-0" : "w-64"
      }`}
      aria-hidden={collapsed}
    >
      <div className="flex w-64 min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Workspaces
          </span>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-md text-lg leading-none text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
              onClick={() => setNewWorkspace((prev) => !prev)}
              title="Add new workspace"
              aria-label="Add new workspace"
            >
              +
            </button>

            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
              onClick={onCollapse}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeftIcon />
            </button>
          </div>
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
                    className={`group flex flex-col gap-0.5 rounded-md px-3 py-2 text-left transition ${
                      isSelected
                        ? "bg-neutral-800/80 text-neutral-100"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                    }`}
                    onClick={() => setSelectedWorkspace(workspace)}
                  >
                    <span className="truncate text-sm">{workspace.name}</span>
                    <span
                      className={`truncate font-mono text-[11px] ${
                        isSelected ? "text-neutral-500" : "text-neutral-700 group-hover:text-neutral-600"
                      }`}
                    >
                      {workspace.path}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default WorkspaceSidebar;
