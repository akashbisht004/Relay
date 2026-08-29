import { useAgent } from "./hooks/useAgent";
import { useWebSocket } from "./hooks/useWebSocket";
import { useWorkspace } from "./hooks/useWorkspace";

import WorkspaceSidebar from "./components/WorkspaceSidebar";
import WorkspaceView from "./components/WorkspaceView";

function App() {
  const { status, lastMessage, sendMessage } = useWebSocket();

  const {
    conversation,
    setConversation,
    agentEvents,
    addUserMessage,
    clearAgentEvents,
  } = useAgent(lastMessage);

  const {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
  } = useWorkspace({
    lastMessage,
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

  return (
    <div className="flex h-screen flex-col overflow-hidden">

      <header className="flex shrink-0 items-center justify-center border-b border-zinc-300 bg-zinc-200 px-4 py-3">
        <h1 className="font-semibold">AI Factory</h1>
      </header>

      <div className="shrink-0 bg-zinc-100 px-3 py-1 text-xs text-zinc-500">
        WebSocket: {status}
      </div>

      <main className="flex min-h-0 flex-1 overflow-hidden bg-zinc-800">
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
