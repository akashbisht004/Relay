import { useState } from "react";
import type { ClientMessage } from "../types/websocket";

type WorkspaceFormProps = {
  setNewWorkspace: (newWorkspace: boolean) => void;
  sendMessage: (message: ClientMessage) => void;
};

function WorkspaceForm({ setNewWorkspace, sendMessage }: WorkspaceFormProps) {
  const [nameInput, setNameInput] = useState("");
  const [pathInput, setPathInput] = useState("");

  const canSave = nameInput.trim() !== "" && pathInput.trim() !== "";

  const handleSave = () => {
    const name = nameInput.trim();
    const path = pathInput.trim();

    if (!name || !path) return;

    sendMessage({
      type: "create_workspace",
      workspaceDetails: { name, path },
    });

    setNameInput("");
    setPathInput("");
    setNewWorkspace(false);
  };

  const inputClass =
    "w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none transition focus:border-neutral-600";

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
      <input
        placeholder="Name"
        className={inputClass}
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
      />

      <input
        placeholder="Path"
        className={inputClass}
        value={pathInput}
        onChange={(e) => setPathInput(e.target.value)}
      />

      <div className="flex justify-end gap-1">
        <button
          type="button"
          className="rounded-md px-3 py-1.5 text-sm text-neutral-400 transition hover:text-neutral-200"
          onClick={() => setNewWorkspace(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          onClick={handleSave}
          disabled={!canSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default WorkspaceForm;
