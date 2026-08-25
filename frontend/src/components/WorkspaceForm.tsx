import { useState } from "react";
import type { CreateWorkspace } from "../types/workspace";
import type { ClientMessage } from "../types/websocket";

type WorkspaceFormProps = {
  setNewWorkspace: (newWorkspace: boolean) => void;
  sendMessage: (message: ClientMessage)=> void;
};

function WorkspaceForm({ setNewWorkspace, sendMessage }: WorkspaceFormProps) {
  const [workspaceInput, setWorkspaceInput] = useState("");
  const [workspaceNameInput, setWorkspaceNameInput] = useState("");

  const createNewWorkspace = (workspace: CreateWorkspace) => {
    const message: ClientMessage = {
      type: "create_workspace",
      workspaceDetails: workspace,
    };

    sendMessage(message);
  };

  return (
    <div className="flex w-full flex-col gap-2 border border-gray-500 p-2">
      <input
        placeholder="Enter path here"
        className="min-w-0 flex-1 border border-gray-500 p-1"
        value={workspaceInput}
        onChange={(e) => setWorkspaceInput(e.target.value)}
      />

      <input
        placeholder="Enter name here"
        className="min-w-0 flex-1 border border-gray-500 p-1"
        value={workspaceNameInput}
        onChange={(e) => setWorkspaceNameInput(e.target.value)}
      />

      <button
        type="button"
        className="shrink-0 cursor-pointer border p-1"
        onClick={() => {
          const path = workspaceInput.trim();
          const name = workspaceNameInput.trim();

          if (!path || !name) {
            return;
          }

          const workspace: CreateWorkspace = {
            name,
            path,
          };

          createNewWorkspace(workspace);

          setWorkspaceInput("");
          setWorkspaceNameInput("");
          setNewWorkspace(false);
        }}
      >
        Save
      </button>
    </div>
  );
}

export default WorkspaceForm;
