import type { AgentEvent } from "../types/agent";

function AgentActivity({ events }: { events: AgentEvent[] }) {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 space-y-2">
      {events.map((event, index) => {
        if (event.type === "tool_start") {
          return (
            <div
              key={`${event.toolCallId}-${index}`}
              className="text-sm text-zinc-600"
            >
              <span className="mr-2">⟳</span>
              {getToolMessage(event.tool)}
            </div>
          );
        }

        return (
          <div
            key={`${event.toolCallId}-result-${index}`}
            className="text-sm text-zinc-500"
          >
            <span className="mr-2">{event.success ? "✓" : "✗"}</span>

            {event.success
              ? `${formatToolName(event.tool)} completed`
              : `${formatToolName(event.tool)} failed`}
          </div>
        );
      })}
    </div>
  );
}

function formatToolName(tool: string) {
  return tool.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getToolMessage(tool: string) {
  switch (tool) {
    case "read_file":
      return "Reading file...";

    case "write_file":
      return "Writing file...";

    case "edit_file":
      return "Editing file...";

    case "search_files":
      return "Searching files...";

    case "list_directory":
      return "Inspecting directory...";

    default:
      return `${formatToolName(tool)}...`;
  }
}

export default AgentActivity;
