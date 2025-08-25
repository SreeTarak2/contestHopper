const express = require("express");
const router = express.Router();

// Middleware to check if user is authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

// Profile route (protected)
router.get("/", ensureAuth, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.displayName,
    email: req.user.emails?.[0].value,
    photo: req.user.photos?.[0].value,
  });
});

module.exports = router;
