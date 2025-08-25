const express = require("express");
const router = express.Router();
// middleware
const authMiddleware = require("../middleware/authMiddleware");
const { getDB } = require("../config/db");
const logger = require("../utils/logger");


const COLLECTION_NAME = process.env.COLLECTIONS_COLLECTION || "collections";

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const db = await getDB();
  if (!db) {
    logger.error("Database not ready for fetching collections");
    return res.status(503).json({ error: "Database not ready." });
  }

  try {
    const results = await db.collection(COLLECTION_NAME).find({}).toArray();
    logger.info(`User ${req.user?.id || "unknown"} fetched ${results.length} collections`);
    res.json({ results });
  } catch (err) {
    logger.error(`Error fetching collections: ${err.stack}`);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
});

