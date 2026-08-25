import type { Workspace } from "../types/workspace";

function WorkspaceView({
  selectedWorkspace,
}: {
  selectedWorkspace: Workspace | null;
}) {
  return (
    <div className="min-h-screen w-full rounded-xl border-2 border-zinc-800 bg-zinc-200 p-4">
      {selectedWorkspace ? (
        <div>
          <h2 className="text-xl font-bold">{selectedWorkspace.name}</h2>

          <p className="mt-2 text-sm text-gray-600">
            Path: {selectedWorkspace.path}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Conversations: {selectedWorkspace.conversations.length}
          </p>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          Select a workspace
        </div>
      )}
    </div>
  );
}

export default WorkspaceView;
