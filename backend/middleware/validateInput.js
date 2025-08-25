const validator = require('validator');

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  // Basic presence
  if (!username || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Trim and sanitize
  const sanitizedUsername = username.trim();
  const sanitizedEmail = email.trim().toLowerCase();

  // Validate email format
  if (!validator.isEmail(sanitizedEmail)) {
    return res.status(400).json({ msg: "Valid email is required" });
  }

  // Username: only letters, numbers, underscores, 3–20 chars
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(sanitizedUsername)) {
    return res.status(400).json({ msg: "Username must be 3-20 characters long and contain only letters, numbers, and underscores" });
  }

  // Password strength
  if (password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters" });
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return res.status(400).json({ msg: "Password must include uppercase, lowercase, and a number" });
  }

  // Attach sanitized values
  req.body.username = sanitizedUsername;
  req.body.email = sanitizedEmail;

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  const sanitizedEmail = email.trim().toLowerCase();
  if (!validator.isEmail(sanitizedEmail)) {
    return res.status(400).json({ msg: "Valid email is required" });
  }

  req.body.email = sanitizedEmail;
  next();
};

module.exports = { validateRegister, validateLogin };