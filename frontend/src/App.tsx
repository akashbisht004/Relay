import { useEffect, useRef, useState } from "react";
import type { CreateWorkspace, Workspace } from "./types/workspace";
import type { ClientMessage, ServerMessage } from "./types/websocket";

function App() {
  const socketRef = useRef<WebSocket | null>(null);

  const [status, setStatus] = useState("Connecting...");

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceInput, setWorkspaceInput] = useState("");
  const [workspaceNameInput, setWorkspaceNameInput] = useState("");
  const [newWorkspace, setNewWorkspace] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socketRef.current = socket;
    console.log(socketRef.current);
    socket.onopen = () => {
      console.log("CONNECTED");
      setStatus("Connected");

      const message: ClientMessage = {
        type: "get_workspaces",
      };

      socket.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
      try {
        const data: ServerMessage = JSON.parse(event.data);

        console.log("RECEIVED:", data);

        switch (data.type) {
          case "workspaces":
            setWorkspaces(data.workspaces);
            break;

          case "workspace_created":
            setWorkspaces((prev) => [...prev, data.workspace]);
            setSelectedWorkspace(data.workspace);
            break;

          case "error":
            console.error("Server error:", data.message);
            break;

          default:
            console.log("Unknown server message");
        }
      } catch (error) {
        console.error("Failed to parse server message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WEBSOCKET ERROR:", error);
      setStatus("Error");
    };

    socket.onclose = () => {
      console.log("CLOSED");
      setStatus("Disconnected");

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const createNewWorkspace = (workspace: CreateWorkspace) => {
    const socket = socketRef.current;
    console.log(socket);
    if (!socket) {
      console.log("No socket");
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.log("Socket isn't open");
      return;
    }

    const message: ClientMessage = {
      type: "create_workspace",
      workspaceDetails: workspace,
    };

    socket.send(JSON.stringify(message));

    console.log("SENT:", message);
  };

  const getAllWorkspaces = () => {
    const socket = socketRef.current;

    if (!socket) {
      console.log("No socket");
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.log("Socket isn't open");
      return;
    }

    const message: ClientMessage = {
      type: "get_workspaces",
    };

    socket.send(JSON.stringify(message));

    console.log("SENT:", message);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex justify-center bg-zinc-200 p-2">
        <h1>AI Factory</h1>
      </div>

      <div className="bg-zinc-100 px-2 py-1 text-sm">WebSocket: {status}</div>

      <div className="flex min-h-screen flex-row border-2 border-gray-400 bg-zinc-800">
        <div className="min-h-screen w-1/4 min-w-40 max-w-3xs rounded-xl border-2 border-zinc-800 bg-zinc-200 p-2">
          {/* Workspace header */}
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
                      selectedWorkspace?.id === workspace.id
                        ? "bg-gray-400"
                        : ""
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
      </div>
    </div>
  );
}

export default App;
