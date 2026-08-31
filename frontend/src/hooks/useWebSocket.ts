import { useCallback, useEffect, useRef, useState } from "react";
import type { ClientMessage, ServerMessage } from "../types/websocket";

type MessageHandler = (message: ServerMessage) => void;

export function useWebSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Set<MessageHandler>>(new Set());
  const [status, setStatus] = useState("Connecting...");

  const sendMessage = useCallback((message: ClientMessage) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not open; dropped message:", message.type);
      return;
    }

    socket.send(JSON.stringify(message));
  }, []);

  const subscribe = useCallback((handler: MessageHandler) => {
    handlersRef.current.add(handler);

    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");
    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("Connected");
      sendMessage({ type: "get_workspaces" });
    };

    socket.onmessage = (event) => {
      try {
        const data: ServerMessage = JSON.parse(event.data);
        handlersRef.current.forEach((handler) => handler(data));
      } catch (error) {
        console.error("Failed to parse server message:", error);
      }
    };

    socket.onerror = () => {
      setStatus("Error");
    };

    socket.onclose = () => {
      setStatus("Disconnected");

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };

    return () => {
      socket.close();
    };
  }, [sendMessage]);

  return {
    status,
    sendMessage,
    subscribe,
  };
}
