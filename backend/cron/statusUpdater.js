const { MongoClient } = require("mongodb");
const cron = require("node-cron");
require("dotenv").config();

const mongourl = "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "contestHopper";
const COLLECTION_NAME = process.env.COLLECTION_NAME || "contests";

async function updateContestStatuses() {
  let client;
  try {
    client = await MongoClient.connect(mongourl);
    const db = client.db(DB_NAME);
    const contestsCollection = db.collection(COLLECTION_NAME);
    console.log("Cron Job: Connected to MongoDB successfully.");

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    // Step 1: Initialize status for contests missing it
    const initializeStatus = await contestsCollection.updateMany(
      { status: { $exists: false } },
      [
        {
          $set: {
            status: {
              $cond: {
                if: { $gte: ["$meta.endiso", thirtyDaysFromNow.toISOString()] },
                then: "upcoming",
                else: {
                  $cond: {
                    if: { $gte: ["$meta.endiso", now.toISOString()] },
                    then: "open",
                    else: "closed",
                  },
                },
              },
            },
          },
        },
      ]
    );
    if (initializeStatus.modifiedCount > 0) {
      console.log(
        `Cron Job: Initialized status for ${initializeStatus.modifiedCount} contests.`
      );
    }

    // Step 2: Update upcoming to open
    const upcomingToOpen = await contestsCollection.updateMany(
      {
        status: "upcoming",
        "meta.endiso": {
          $lte: thirtyDaysFromNow.toISOString(),
          $gte: now.toISOString(),
        },
      },
      { $set: { status: "open" } }
    );
    if (upcomingToOpen.modifiedCount > 0) {
      console.log(
        `Cron Job: Updated ${upcomingToOpen.modifiedCount} contests from 'upcoming' to 'open'.`
      );
    }

    // Step 3: Update open to closed
    const openToClosed = await contestsCollection.updateMany(
      {
        status: "open",
        "meta.endiso": { $lt: now.toISOString() },
      },
      { $set: { status: "closed" } }
    );
    if (openToClosed.modifiedCount > 0) {
      console.log(
        `Cron Job: Updated ${openToClosed.modifiedCount} contests from 'open' to 'closed'.`
      );
    }

    // Step 4: Handle invalid or missing meta.endiso
    const setDefaultStatus = await contestsCollection.updateMany(
      {
        $or: [
          { "meta.endiso": { $exists: false } },
          { "meta.endiso": { $eq: null } },
          { "meta.endiso": { $not: { $type: "string" } } },
        ],
      },
      { $set: { status: "closed", "meta.endiso": now.toISOString() } }
    );
    if (setDefaultStatus.modifiedCount > 0) {
      console.log(
        `Cron Job: Set default status for ${setDefaultStatus.modifiedCount} contests with invalid/missing endiso.`
      );
    }

    console.log("Cron Job: Status update process finished.");
  } catch (error) {
    console.error("Cron Job Error:", error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("Cron Job: MongoDB connection closed.");
    }
  }
}

// Schedule the cron job to run every minute for local testing
cron.schedule("* * * * *", () => {
  console.log("Cron Job: Starting contest status update...");
  updateContestStatuses();
});

module.exports = { updateContestStatuses };
