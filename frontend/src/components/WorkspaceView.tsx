import type { ClientMessage } from "../types/websocket";
import type { Workspace } from "../types/workspace";
import ChatInput from "./ChatInput";

function WorkspaceView({
  selectedWorkspace,
  sendMessage,
}: {
  selectedWorkspace: Workspace | null;
  sendMessage: (message: ClientMessage) => void;
}) {
   return (
    <div className="flex min-w-0 flex-1 flex-col rounded-xl border-2 border-zinc-800 bg-zinc-200">

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {selectedWorkspace ? (
          <div>
            <h2 className="text-xl font-bold">
              {selectedWorkspace.name}
            </h2>

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

      <ChatInput sendMessage={sendMessage} selectedWorkspace={selectedWorkspace} />

    </div>
  );
}

export default WorkspaceView;