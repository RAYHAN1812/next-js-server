const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables!");
}

let client;
let db;

// Reuse client for Vercel serverless
async function connectDB() {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  try {
    await client.connect();
    console.log("MongoDB connected");
    db = client.db("event_management");
    return db;
  } catch (err) {
    console.error("DB Connection Error:", err);
    throw err;
  }
}

module.exports = { connectDB };
