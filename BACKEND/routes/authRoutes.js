const express = require("express");

const middleware = require("../middleware/authMiddleware.js");

const { userRegistration, userLogin } = require("../controllers/authController.js");
const { getProfile } = require("../controllers/profileController");

const router = express.Router();

router.post("/register", userRegistration);
router.post("/login", userLogin);
router.get("/profile", middleware, getProfile);

module.exports = router;



