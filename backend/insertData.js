require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "contestHopper";
const COLLECTION_NAME = "contests";
const FILE_NAME = "opportunityDesk.json";
const folderPath = path.resolve(__dirname, "../assets/data");

async function connectMongo() {
  const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
  await client.connect();
  console.log("✅ MongoDB connected");
  return client;
}

async function importData() {
  const filePath = path.join(folderPath, FILE_NAME);

  if (!fs.existsSync(filePath)) {
    console.error("❌ JSON file not found:", filePath);
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, "utf-8");

  let parsedData;
  try {
    parsedData = JSON.parse(rawData);
  } catch (err) {
    console.error("❌ Invalid JSON format:", err);
    process.exit(1);
  }

  if (!Array.isArray(parsedData)) {
    parsedData = [parsedData];
  }

  const client = await connectMongo();
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  try {
    const result = await collection.insertMany(parsedData);
    console.log(
      `✅ Inserted ${result.insertedCount} documents into '${COLLECTION_NAME}'`
    );
    await collection.createIndex({
      title: "text",
      description: "text",
      category: "text",
      "meta.tags": "text",
    });
  } catch (err) {
    console.error("❌ MongoDB insertion error:", err);
  } finally {
    await client.close();
    console.log("🔒 MongoDB connection closed");
  }
}

importData();
