// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");

const app = express();
const PORT = process.env.PORT || 5000;

// JSON middleware
app.use(express.json());

// CORS middleware - fixed for localhost and Vercel frontend
app.use(cors({
  origin: [
    "http://localhost:3000",                     // for local development
    "https://event-management3.vercel.app"       // your deployed frontend
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
}));

// Connect to DB and start server
connectDB()
  .then((db) => {
    // attach db to request object
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/events", eventRoutes);

    // Test route
    app.get("/", (req, res) => res.send("Backend server running"));

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
