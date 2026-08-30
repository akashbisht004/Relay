import type { AgentEvent } from "../types/agent";
import { Spinner, ThinkingDots } from "./Loader";

type ToolStart = Extract<AgentEvent, { type: "tool_start" }>;
type ToolResult = Extract<AgentEvent, { type: "tool_result" }>;

function AgentActivity({
  events,
  isProcessing,
}: {
  events: AgentEvent[];
  isProcessing: boolean;
}) {
  if (events.length === 0 && !isProcessing) {
    return null;
  }

  const results = new Map<string, ToolResult>();
  for (const event of events) {
    if (event.type === "tool_result") {
      results.set(event.toolCallId, event);
    }
  }

  const starts = events.filter(
    (event): event is ToolStart => event.type === "tool_start",
  );

  const hasActiveTool = starts.some((start) => !results.has(start.toolCallId));

  return (
    <div className="space-y-1.5">
      {starts.map((event, index) => {
        const result = results.get(event.toolCallId);

        if (!result) {
          return (
            <div
              key={`${event.toolCallId}-${index}`}
              className="flex items-center gap-2 text-sm text-neutral-300"
            >
              <Spinner className="h-3.5 w-3.5 text-amber-400" />
              <span>{getToolMessage(event.tool)}</span>
            </div>
          );
        }

        return (
          <div
            key={`${event.toolCallId}-${index}`}
            className="flex items-center gap-2 text-sm text-neutral-500"
          >
            <span
              className={result.success ? "text-emerald-500" : "text-red-500"}
            >
              {result.success ? "✓" : "✗"}
            </span>

            <span>
              {result.success
                ? `${formatToolName(event.tool)} completed`
                : `${formatToolName(event.tool)} failed`}
            </span>
          </div>
        );
      })}

      {isProcessing && !hasActiveTool && (
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <ThinkingDots className="text-amber-400" />
          <span className="af-shimmer font-medium">Thinking</span>
        </div>
      )}
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
