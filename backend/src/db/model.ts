import mongoose, { model, Mongoose } from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema({
  messages: [
    {
      role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
  ],
});

const workspaceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  conversationId:
  {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true
  },
});

export const ConversationModel = model("Conversation", conversationSchema);
export const WorkspaceModel = model("Workspace", workspaceSchema);

