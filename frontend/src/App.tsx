import { useEffect, useRef, useState } from "react";

function App() {
  const socketRef = useRef<WebSocket | null>(null);

  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("CONNECTED");
      setStatus("Connected");
    };

    socket.onmessage = (event) => {
      console.log("RECEIVED:", event.data);
      setReceivedMessage(event.data);
    };

    socket.onerror = (error) => {
      console.error("WEBSOCKET ERROR:", error);
      setStatus("Error");
    };

    socket.onclose = () => {
      console.log("CLOSED");
      setStatus("Disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    const socket = socketRef.current;

    console.log("SOCKET:", socket);
    console.log("READY STATE:", socket?.readyState);

    if (!socket) {
      console.log("No socket");
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.log("Socket isn't open");
      return;
    }

    socket.send(message);

    console.log("SENT:", message);
  };

  return (
    <div>
      <h1>WebSocket Test</h1>

      <p>Status: {status}</p>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>
        Send
      </button>

      <p>Server: {receivedMessage}</p>
    </div>
  );
}

export default App;