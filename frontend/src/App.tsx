import { useAgent } from "./hooks/useAgent";
import { useWebSocket } from "./hooks/useWebSocket";
import { useWorkspace } from "./hooks/useWorkspace";
import { useState } from "react";

import type { ModelSelection } from "./types/workspace";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import WorkspaceView from "./components/WorkspaceView";
import Logo from "./components/Logo";

function App() {
  const [modelSelection, setModelSelection] = useState<ModelSelection>({
    provider: "gemini",
    model: "gemini-3.6-flash",
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { status, sendMessage, subscribe } = useWebSocket();

  const {
    conversation,
    setConversation,
    agentEvents,
    isProcessing,
    addUserMessage,
    clearAgentEvents,
  } = useAgent(subscribe);

  const { workspaces, selectedWorkspace, setSelectedWorkspace } = useWorkspace({
    subscribe,
    sendMessage,
    clearAgentEvents,
    setConversation,
  });

  const handleSendMessage = (message: string) => {
    if (!selectedWorkspace) return;

    addUserMessage(message);
    clearAgentEvents();

    sendMessage({
      type: "chat_message",
      workspaceId: selectedWorkspace.id,
      message,
      provider: modelSelection.provider,
      model: modelSelection.model,
    });
  };

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const isConnected = status === "Connected";
  const statusColor = isConnected
    ? "bg-emerald-500"
    : status === "Connecting..."
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-950 text-neutral-200">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-800 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
            title={sidebarCollapsed ? "Show workspaces" : "Hide workspaces"}
            aria-label={sidebarCollapsed ? "Show workspaces" : "Hide workspaces"}
          >
            <PanelIcon />
          </button>

          <div className="flex items-center gap-2 pl-1">
            <Logo className="h-6 w-6" />
            <h1 className="text-sm font-semibold tracking-tight text-neutral-100">
              Relay
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 px-2.5 py-1 text-xs text-neutral-400">
          <span
            className={`h-1.5 w-1.5 rounded-full ${statusColor} ${
              isConnected ? "" : "animate-pulse"
            }`}
          />
          {status}
        </div>
      </header>

      <main className="flex min-h-0 flex-1 overflow-hidden">
        <WorkspaceSidebar
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}
          sendMessage={sendMessage}
          collapsed={sidebarCollapsed}
          onCollapse={toggleSidebar}
        />

        <WorkspaceView
          selectedWorkspace={selectedWorkspace}
          conversation={conversation}
          onSendMessage={handleSendMessage}
          agentEvents={agentEvents}
          isProcessing={isProcessing}
          modelSelection={modelSelection}
          setModelSelection={setModelSelection}
        />
      </main>
    </div>
  );
}

function PanelIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="9" y1="4" x2="9" y2="20" />
    </svg>
  );
}

export default App;
