const Goal = require("../models/goal");

const addGoal = async (req,res) => {
    try {
        const { goalName, targetAmount, savedAmount, month, year } = req.body;

        if(!goalName || !targetAmount || !month || !year) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }
        const goal = await Goal.create({
            user: req.user.id,
            goalName,
            targetAmount, 
            savedAmount: savedAmount ?? 0,
            month, 
            year 
        });
        res.status(201).json({
            message: "Goal added successfully!",
            goal
        });

    } catch(error) {
        res.status(500).json({
            message: "Failed to add goal",
            error: error.message
        });
    }
};

const getGoals = async (req,res) => {
    try {
        const { month, year } = req.query;
        const goals = await Goal.find({
            user: req.user.id,
            month,
            year
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Goals fetched successfully!",
            goals
        });

    } catch(error) {
        res.status(500).json({
            message: "Failed to fetch goals",
            error: error.message
        });
    }
};

const updateGoal = async (req,res) => {
    try {
        const { goalName, targetAmount, savedAmount } = req.body;

        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        if(!goal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }
        if(goalName !== undefined) {
            if (!goalName.trim()) {
                return res.status(400).json({
                    message: "Goal name cannot be empty"
                });
            }
            goal.goalName = goalName.trim();
        }
        if(targetAmount !== undefined) {
            if (
                !Number.isFinite(Number(targetAmount)) ||
                Number(targetAmount) < 1
            ) {
                return res.status(400).json({
                    message: "Please provide a valid target amount"
                });
            }
             goal.targetAmount = Number(targetAmount);
        }
        if(savedAmount !== undefined) {
            if (
                !Number.isFinite(Number(savedAmount)) ||
                Number(savedAmount) < 0
            ) {
                return res.status(400).json({
                    message: "Please provide a valid saved amount"
                });
            }
            goal.savedAmount = Number(savedAmount);
        }
        await goal.save();

        res.status(200).json({
            message: "Goal updated successfully!",
            goal
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update goal",
            error: error.message
        });
    }
};

const deleteGoal = async (req,res) => {
    try {
        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if(!goal) {
            return  res.status(404).json({
                message: "Goal not found"
            });
        }
        res.status(200).json({
            message: "Goal deleted successfully!"
        });

    } catch(error) {
        res.status(500).json({
            message: "Failed to delete goal",
            error: error.message
        });
    }
};

module.exports = { addGoal, getGoals, updateGoal, deleteGoal };