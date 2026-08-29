import { useAgent } from "./hooks/useAgent";
import { useWebSocket } from "./hooks/useWebSocket";
import { useWorkspace } from "./hooks/useWorkspace";

import WorkspaceSidebar from "./components/WorkspaceSidebar";
import WorkspaceView from "./components/WorkspaceView";

function App() {
  const { status, sendMessage, subscribe } = useWebSocket();

  const {
    conversation,
    setConversation,
    agentEvents,
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
    });
  };

  const isConnected = status === "Connected";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-950 text-neutral-200">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-800 px-5 py-3">
        <h1 className="text-sm font-medium tracking-tight text-neutral-100">
          AI Factory
        </h1>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isConnected ? "bg-emerald-500" : "bg-neutral-600"
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
        />

        <WorkspaceView
          selectedWorkspace={selectedWorkspace}
          conversation={conversation}
          onSendMessage={handleSendMessage}
          agentEvents={agentEvents}
        />
      </main>
    </div>
  );
}

export default App;
