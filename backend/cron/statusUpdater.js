const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongourl = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

async function updateContestStatuses() {
  let client;
  
  try {
    client = await MongoClient.connect(mongourl);
    const db = client.db(DB_NAME);
    const contestsCollection = db.collection(COLLECTION_NAME);
    console.log('Cron Job: Connected to MongoDB successfully.');

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const upcomingToOpen = await contestsCollection.updateMany(
      {
        status: "upcoming",
        "meta.endISO": { $lte: thirtyDaysFromNow.toISOString() },
      },
      { $set: { status: "open" } }
    );
    if (upcomingToOpen.modifiedCount > 0) {
      console.log(`Cron Job: Updated ${upcomingToOpen.modifiedCount} contests from 'upcoming' to 'open'.`);
    }

    const openToClosed = await contestsCollection.updateMany(
      {
        status: "open",
        "meta.endISO": { $lt: now.toISOString() },
      },
      { $set: { status: "closed" } }
    );
    if (openToClosed.modifiedCount > 0) {
      console.log(`Cron Job: Updated ${openToClosed.modifiedCount} contests from 'open' to 'closed'.`);
    }
    
    console.log('Cron Job: Status update process finished.');

  } catch (error) {
    console.error('Cron Job Error:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('Cron Job: MongoDB connection closed.');
    }
  }
}

updateContestStatuses();
module.exports = { updateContestStatuses };
