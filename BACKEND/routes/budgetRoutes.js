const express = require("express");

const middleware = require("../middleware/authMiddleware");

const { setBudget, getBudget } = require("../controllers/budgetController");

const router = express.Router();

router.post("/", middleware, setBudget);
router.get("/", middleware, getBudget);

module.exports = router;