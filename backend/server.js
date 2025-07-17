const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require('dotenv').config();

const corsOptions = {
  origin: "https://contesthopper.pages.dev",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

const app = express();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

const PORT = 3000;

const mongourl = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "contestHopper";
const COLLECTION_NAME = "contests";

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
    const results = await db
      .collection(COLLECTION_NAME)
      .find({})
      .toArray();
    res.json({results});
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
    const results = await db
      .collection(COLLECTION_NAME)
      .find({ $text: { $search: query } })
      .toArray();
    res.json({ results });
  } catch (err) {
    console.err(`Error: ${err}`);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});
