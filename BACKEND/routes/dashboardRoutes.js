const express = require("express");

const middleware = require("../middleware/authMiddleware");

const { getDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", middleware, getDashboard);

module.exports = router;