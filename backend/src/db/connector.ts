import mongoose from "mongoose";

async function connectDB(): Promise<void> {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        throw new Error("MONGO_URL is not defined");
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}

export default connectDB;