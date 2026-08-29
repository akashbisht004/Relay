# AI Coding Agent Backend

A Node.js & TypeScript WebSocket backend service that powers an interactive AI coding agent. It enables real-time project workspace management, code inspection, file modifications, and persistent conversation history.

## Features

- **Real-Time WebSocket Communication**: Handles workspace creation, message dispatching, and live event streaming (tool execution starts, tool results, and final responses).
- **AI Agent Capabilities**: Powered by Google Gemini (`@google/genai`) to inspect workspace files, directory listings, and perform file edits/writes based on user requests.
- **Persistent Storage**: MongoDB database integration (via Mongoose) for workspaces and message history.
- **Type-Safe Schema Validation**: Zod-validated agent tool parameters and message schemas.

## Tech Stack

- **Runtime & Language**: Node.js, TypeScript
- **WebSockets**: `ws`
- **AI Framework**: Google Gemini SDK (`@google/genai`)
- **Database**: MongoDB & Mongoose
- **Tooling**: `tsx`, `dotenv`, `zod`

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance running locally or hosted (e.g., MongoDB Atlas)
- Gemini API Key

### Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb://localhost:27017/ai-agent
PORT=3000
```

### Installation & Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build & Production Start**:
   ```bash
   npm run build
   npm start
   ```

## WebSocket API Commands

Clients connect to `ws://localhost:3000` and send JSON messages:

- `create_workspace`: Creates a new workspace and initializes conversation history.
- `get_workspaces`: Retrieves all saved workspaces.
- `chat_message`: Sends a message to the agent for a workspace.
- `get_conversation`: Retrieves conversation history for a workspace.
