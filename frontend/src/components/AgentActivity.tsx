import type { AgentEvent } from "../types/agent";

function AgentActivity({ events }: { events: AgentEvent[] }) {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      {events.map((event, index) => {
        if (event.type === "tool_start") {
          return (
            <div
              key={`${event.toolCallId}-${index}`}
              className="flex items-center gap-2 text-sm text-neutral-400"
            >
              <span className="text-neutral-500">⟳</span>
              {getToolMessage(event.tool)}
            </div>
          );
        }

        return (
          <div
            key={`${event.toolCallId}-result-${index}`}
            className="flex items-center gap-2 text-sm text-neutral-500"
          >
            <span className={event.success ? "text-emerald-500" : "text-red-500"}>
              {event.success ? "✓" : "✗"}
            </span>

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
