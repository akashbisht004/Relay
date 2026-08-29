import { useState } from "react";
import type { AgentEvent } from "../types/agent";

export function useAgentEvents() {
  
  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>([]);

  const addEvent = (event: AgentEvent) => {
    setAgentEvents((prev) => [
      ...prev,
      event,
    ]);
  };

  const clearEvents = () => {
    setAgentEvents([]);
  };

  return {
    agentEvents,
    addEvent,
    clearEvents,
  };
}
