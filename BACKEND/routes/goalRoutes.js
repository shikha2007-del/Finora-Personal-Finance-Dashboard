const express = require("express");

const { addGoal, getGoals, updateGoal, deleteGoal } = require("../controllers/goalController");

const middleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", middleware, addGoal);
router.get("/", middleware, getGoals);
router.put("/:id", middleware, updateGoal);
router.delete("/:id", middleware, deleteGoal);

module.exports = router;