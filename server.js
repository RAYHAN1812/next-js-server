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

// CORS middleware - function-based to allow multiple origins
const allowedOrigins = [
  "http://localhost:3000",                   // local frontend
  "https://event-management3.vercel.app"    // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
