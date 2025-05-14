import { configDotenv } from "dotenv";
configDotenv(); //Load environment variables from .env file into process.env

// const express = require("express");
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./db/connect.js";
import authRoutes from "./routes/authRoutes.js";

const server = express();
const __dirname = path.resolve();

// Middleware to enable CORS in DEVELOPMENT mode
if (process.env.NODE_ENV === "development") {
  server.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
}

// Middlewares
server.use(express.json()); // For parsing incoming requuests with JSON payloads
server.use(cookieParser()); // For parsing cookies in incoming requests

// For Testing Purpose
if (process.env.NODE_ENV === "development") {
  server.get("/", (req, res) => {
    console.log("Namaste Duniya!!");
    res.send("Namaste Sansaar!!");
  });
}

// AUTH API
server.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  server.use(express.static(path.join(__dirname, "frontend", "dist")));

  server.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 8000;

server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is UP and running on port: ${PORT}`);
  } catch (error) {
    console.log("Error starting server:", error.message);

    // Terminate the process
    process.exit(1); // 0 for success, 1 for failure
  }
});
