import { useEffect, useState } from "react";
import type { Workspace } from "./types/workspace";
import type { ClientMessage } from "./types/websocket";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import WorkspaceView from "./components/WorkspaceView";
import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  const { status, lastMessage, sendMessage } = useWebSocket();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case "workspaces":
        setWorkspaces(lastMessage.workspaces);
        break;

      case "workspace_created":
        setWorkspaces((prev) => [...prev, lastMessage.workspace]);
        setSelectedWorkspace(lastMessage.workspace);
        break;

      case "error":
        console.error("Server error:", lastMessage.message);
        break;

      default:
        console.log("Unknown server message");
    }
  }, [lastMessage]);

  const getAllWorkspaces = () => {
    const message: ClientMessage = {
      type: "get_workspaces",
    };
    sendMessage(message);
  };

  return (
    <div className="min-h-screen w-full">

      <div className="flex justify-center bg-zinc-200 p-2">
        <h1>AI Factory</h1>
      </div>

      <div className="bg-zinc-100 px-2 py-1 text-sm">WebSocket: {status}</div>

      <div className="flex min-h-screen flex-row border-2 border-gray-400 bg-zinc-800">
        <WorkspaceSidebar
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}
          sendMessage={sendMessage}
        />
        <WorkspaceView selectedWorkspace={selectedWorkspace} />
      </div>
      
    </div>
  );
}

export default App;
