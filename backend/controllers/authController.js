const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");
const logger = require("../utils/logger");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const COLLECTION_NAME = process.env.USERS_COLLECTION || "users";

const createJWTToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const sendDetails = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
});

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    logger.warn("Registration attempt with missing fields", {
      username,
      email,
    });
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (password.length < 6) {
    logger.warn("Weak password during registration", { email });
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters" });
  }

  try {
    const db = getDB();
    const collection = db.collection(COLLECTION_NAME);

    const existingUser = await collection.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      logger.info("Duplicate registration attempt", { email, username });
      return res.status(400).json({ msg: "Email or username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await collection.insertOne({
      username,
      email,
      password: hashedPassword,
      avatar: `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
        username
      )}`,
      createdAt: new Date(),
    });

    const token = createJWTToken(result.insertedId.toString());
    const userObj = {
      _id: result.insertedId,
      username,
      email,
      avatar: `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
        username
      )}`,
    };
    logger.info("User registered successfully", {
      userId: result.insertedId,
      email,
    });

    res.status(201).json({ token, user: sendDetails(userObj) });
  } catch (err) {
    logger.error("Register error", { error: err.message, stack: err.stack });
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// login logic
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn("Login attempt with missing fields");
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const db = getDB();
    const collection = db.collection(COLLECTION_NAME);

    const user = await collection.findOne({ email });
    if (!user) {
      logger.warn("Login failed - user not found", { email });
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn("Login failed - wrong password", { email });
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = createJWTToken(user._id.toString());

    logger.info("User logged in successfully", { userId: user._id, email });

    res.json({ token, user: sendDetails(user) });
  } catch (err) {
    logger.error("Login error", { error: err.message, stack: err.stack });
    res.status(500).json({ msg: "Server error during login" });
  }
};

module.exports = { register, login };
