import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connection to MongoDB:", error);
    throw new Error("MongoDB connection failed!!");

    // Terminate the process at server startup, not during DB conection
    // process.exit(1); // 0 for success, 1 for failure
  }
};
