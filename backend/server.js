const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");
const logger = require("./utils/logger");

// Import routes
const authRoutes = require("./routes/authRoute");
const contestRoutes = require("./routes/contestsRoute");
const profileRoute = require("./routes/profileRoute");


const corsOptions = {
  origin: [
    "https://contesthopper.live",
    "https://contesthopper.pages.dev",
    // "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

const app = express();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.set("trust proxy", 1);

app.use("/api/auth", authRoutes);
app.use("/api/contests", apiLimiter, contestRoutes);
app.use("/profile", profileRoute);



const PORT = process.env.PORT || 3000;
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      // console.log(`🚀 Server running at ${PORT}`);
      logger.info(`🚀 Server running at ${PORT}`);
    });
  } catch (err) {
    // console.error("❌ Failed to start server:", err);
    logger.error(`❌ Failed to start server: ${err}`);
    process.exit(1);
  }
}

startServer();
