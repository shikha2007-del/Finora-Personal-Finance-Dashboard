const express = require("express");

const middleware = require("../middleware/authMiddleware");

const { createTransaction, getTransaction, updateTransaction, deleteTransaction } = require("../controllers/transactionController");

const router = express.Router();

router.post("/", middleware, createTransaction);
router.get("/", middleware, getTransaction);
router.put("/:id", middleware, updateTransaction);
router.delete("/:id", middleware, deleteTransaction);

module.exports = router;