const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const {updateContestStatuses} = require("./cron/statusUpdater");

const corsOptions = {
  origin: ["https://contesthopper.live","https://contesthopper.pages.dev", "http://127.0.0.1:5500"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

const app = express();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

const PORT = 3000;

// const mongourl = process.env.MONGODB_URI || "mongodb://localhost:27017";
const mongourl = "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "contestHopper";
const COLLECTION_NAME = process.env.COLLECTION_NAME || "contests";
let db;

MongoClient.connect(mongourl)
  .then((client) => {
    console.log("Connected successfully...");
    db = client.db(DB_NAME);
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

app.get("/contests", async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: "Database not ready." });
  }
  try {
    const results = await db.collection(COLLECTION_NAME).find({}).toArray();
    res.json({ results });
  } catch (err) {
    console.error(`Error: ${err}`);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/search", async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: "Database not ready." });
  }
  const query = req.query.q;
  // console.log(req.query);
  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }
  try {
    const searchFilter = query
      ? {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { "meta.tags": { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const [results, totalCount] = await Promise.all([
      db.collection(COLLECTION_NAME).find(searchFilter).limit(10).toArray(),
      db.collection(COLLECTION_NAME).countDocuments(searchFilter),
    ]);

    res.json({ results, totalCount });
  } catch (err) {
    console.err(`Error: ${err}`);
    res.status(500).json({ error: "Server error" });
  }
});


app.post('/cron/update-contests', async (req, res) => {
  try {
    const result = await updateContestStatuses();
    res.json({ message: 'Success', ...result });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});
