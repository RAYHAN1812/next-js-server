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

// CORS middleware - dynamic for localhost and Vercel frontend
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",                  // local dev
      "https://event-management3.vercel.app"    // deployed frontend
    ];
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
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
