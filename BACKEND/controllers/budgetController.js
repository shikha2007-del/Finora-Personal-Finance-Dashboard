const Budget = require("../models/budget");

const setBudget = async (req,res) => {
    try {
        const { amount,month, year } = req.body;

        const budget = await Budget.findOneAndUpdate(
            {
                user: req.user.id,
                month,
                year
            },
            {
                amount,
                user: req.user.id,
                month,
                year
            },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true
            }
        );
        return res.status(200).json({
            message: "Budget saved successfully!",
            budget
        });

    } catch(error) {
        return res.status(500).json({
            message: "Failed to save budget",
            error: error.message
        });
    }
};

const getBudget = async (req,res) => {
    try {
        const { month, year } = req.query;

        const budget = await Budget.findOne({
            user: req.user.id,
            month,
            year
        });
        if(!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }
        return res.status(200).json({
            message: "Budget fetched successfully!",
            budget
        })

    } catch(error) {
        return res.status(500).json({
            message: "Failed to fetch budget",
            error: error.message
        });
    }
};

module.exports = { setBudget, getBudget };