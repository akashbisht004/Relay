import { WebSocketServer } from 'ws';
import type { ClientMessage, ServerMessage } from './types/websocket';
import connectDB from './db/connector';
import { handleChatMessage, createWorkspace, getAllWorkspace, getConversation } from './services/workspace.service';
import { configDotenv } from 'dotenv';

configDotenv();

async function startServer() {
    try {
        await connectDB();
        console.log("Server starting...");

        const wss = new WebSocketServer({
            port: 3000,
        });

        console.log("WebSocket server running on port 3000");

        wss.on("connection", (socket) => {
            console.log("Client connected");
            
            socket.on("message", async (rawMessage) => {
                try {
                    const message: ClientMessage = JSON.parse(rawMessage.toString());
                    console.log("got msg of type: ", message.type)

                    switch (message.type) {
                        case "create_workspace": {
                            const workspace = await createWorkspace(message.workspaceDetails);

                            const response: ServerMessage = {
                                type: "workspace_created",
                                workspace,
                            };

                            socket.send(JSON.stringify(response));
                            break;
                        }

                        case "get_workspaces": {
                            const workspaces = await getAllWorkspace();

                            const response: ServerMessage = {
                                type: "workspaces",
                                workspaces,
                            };

                            socket.send(JSON.stringify(response));
                            break;
                        }

                        case "chat_message": {
                            await handleChatMessage(
                                message.workspaceId,
                                message.message,
                                message.provider,
                                message.model,
                                (event) => {
                                    socket.send(JSON.stringify(event));
                                }
                            );

                            break;
                        }

                        case "get_conversation": {
                            const conversationId = message.conversationId;
                            const conversation = await getConversation(conversationId)
                            const response: ServerMessage = {
                                type: "conversation",
                                conversation
                            }
                            socket.send(JSON.stringify(response));
                            break;
                        }

                    }
                } catch (error) {
                    console.error("WebSocket message error:", error);

                    const response: ServerMessage = {
                        type: "error",
                        message: "Something went wrong",
                    };

                    socket.send(JSON.stringify(response));
                }
            });

            socket.on("close", () => {
                console.log("Client disconnected");
            });
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();


