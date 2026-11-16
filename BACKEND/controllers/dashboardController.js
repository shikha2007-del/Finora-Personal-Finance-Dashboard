const mongoose = require("mongoose");
// const User = require("../models/user");
const Transaction = require("../models/transaction");

const getDashboard = async (req,res) => {
    try {
        const userId = req.user.id;

        const summary = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            },
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        summary.forEach((item) => {
            if(item._id === "income") {
                totalIncome = item.total;
            } else if(item._id === "expense") {
                totalExpense = item.total;
            }
        });

        const balance = totalIncome - totalExpense;

        const recentTransactions = await Transaction.find({
            user: req.user.id
        }).sort({ date: -1 }).limit(5).select("-user");

        const expenseAnalytics = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),
                    type: "expense"
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $sort: {
                    totalAmount: -1
                }
            }
        ]);

        return res.status(200).json({
            message: "Dashboard fetched successfully!",
            totalIncome,
            totalExpense,
            balance,
            recentTransactions,
            expenseAnalytics
        })

    } catch(error) {
        return res.status(500).json({
            message: "Failed to fetch dashboard",
            error: error.message
        });
    }
};

module.exports = { getDashboard };