// contestsRoute.js
const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");
const { updateContestStatuses } = require("../cron/statusUpdater");
const logger = require("../utils/logger");

const COLLECTION_NAME = process.env.COLLECTION_NAME || "contests";

// ✅ GET all contests
router.get("/", async (req, res) => {
  const db = await getDB();
  if (!db) {
    logger.error("Database not ready while fetching contests.");
    return res.status(503).json({ error: "Database not ready." });
  }
  try {
    const results = await db.collection(COLLECTION_NAME).find({}).toArray();
    logger.info(`Fetched ${results.length} contests`);
    res.json({ results });
  } catch (err) {
    logger.error(`Error occurred while fetching contests: ${err.stack}`);
    res
      .status(500)
      .json({ error: "Failed to fetch contests", details: err.message });
  }
});

// ✅ Search contests
router.get("/search", async (req, res) => {
  const db = await getDB();
  if (!db) {
    logger.error("Database not ready while searching contests.");
    return res.status(503).json({ error: "Database not ready." });
  }

  const query = (req.query.q || "").trim();
  if (!query) {
    logger.warn("Search attempted with missing query");
    return res.status(400).json({ error: "Missing search query" });
  }
  if (query.length > 50) {
    logger.warn(`Search query too long: "${query}"`);
    return res.status(400).json({ error: "Search query too long" });
  }

  try {
    const searchFilter = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { "meta.tags": { $regex: query, $options: "i" } },
      ],
    };

    const [results, totalCount] = await Promise.all([
      db.collection(COLLECTION_NAME).find(searchFilter).limit(10).toArray(),
      db.collection(COLLECTION_NAME).countDocuments(searchFilter),
    ]);

    logger.info(
      `Search for "${query}" returned ${results.length}/${totalCount} contests`
    );
    res.json({ results, totalCount });
  } catch (err) {
    logger.error(`Search error: ${err.stack}`);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Cron route to update contest statuses
router.post("/cron/update-contests", async (req, res) => {
  try {
    const result = await updateContestStatuses();
    logger.info("Contest statuses updated successfully", result);
    res.json({ message: "Success", ...result });
  } catch (err) {
    logger.error(`Cron update failed: ${err.stack}`);
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

module.exports = router;
