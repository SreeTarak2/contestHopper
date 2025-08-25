const express = require("express");
const router = express.Router();
const {register , login} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const {authLimiter} = require("../middleware/rateLimiter")
const {validateLogin , validateRegister} = require("../middleware/validateInput");


router.post("/login", authLimiter, validateLogin, login);
router.post("/register", authLimiter, validateRegister, register);
router.get("/protected" , auth , (req , res) =>{
    res.json({ msg: 'This is a protected route', userId: req.user });
});

module.exports = router;