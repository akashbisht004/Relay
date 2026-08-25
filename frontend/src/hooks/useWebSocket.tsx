import { useEffect, useRef, useState } from "react";
import type { ClientMessage, ServerMessage } from "../types/websocket";

export function useWebSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState("Connecting...");
  const [lastMessage, setLastMessage] = useState<ServerMessage | null>(null);

  const sendMessage = (message: ClientMessage) => {
    const socket = socketRef.current;

    if (!socket) {
      console.log("No socket");
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.log("Socket isn't open");
      return;
    }

    socket.send(JSON.stringify(message));
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("CONNECTED");
      setStatus("Connected");
      sendMessage({ type: "get_workspaces" });
    };

    socket.onmessage = (event) => {
      try {
        const data: ServerMessage = JSON.parse(event.data);
        console.log("RECEIVED:", data);
        setLastMessage(data);
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

  return {
    socketRef,
    status,
    lastMessage,
    sendMessage,
  };
}
