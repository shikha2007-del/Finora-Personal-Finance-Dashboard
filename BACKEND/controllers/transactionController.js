const Transaction = require("../models/transaction");

const createTransaction = async (req,res) => {
    try {
        const { title, amount, type, category, date, description } = req.body;

        if(!title || amount===undefined || !type || !category){
            return res.status(400).json({
                message: "Please provide all required feilds"
            });
        }
        const transaction = await Transaction.create({
            title, 
            amount, 
            type, 
            category, 
            date, 
            description,
            user: req.user.id 
        });

        return res.status(201).json({
            message: "Transaction created successfully!",
            transaction 
        })

    } catch(error) {
        return res.status(500).json({
            message: "Failed to create transaction",
            error: error.message
        });
    }
};

const getTransaction = async (req,res) => {
    try {
        const transaction = await Transaction.find({
            user: req.user.id
        }).sort({ date: -1 });

        return res.status(200).json({
            message: "Transactions fetched successfully!",
            count: transaction.length,
            transaction
        })

    } catch(error) {
        return res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
};

const updateTransaction = async (req,res) => {
    try {
        const { id } = req.params;

        const updatedtransaction = await Transaction.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            },
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );
        if(!updatedtransaction){
            return res.status(404).json({
                message: "Transaction not found"
            });
        }
        return res.status(200).json({
            message: "Transaction updated successfully",
            transaction: updatedtransaction
        })

    } catch(error) {
        return res.status(500).json({
            message: "Failed to update transactions",
            error: error.message
        });
    }
};

const deleteTransaction = async (req,res) => {
    try {
        const { id } = req.params;

        const deletedtransaction = await Transaction.findOneAndDelete(
            {
                _id: id,
                user: req.user.id
            }
        );
        if(!deletedtransaction){
            return res.status(404).json({
                message: "Transactionot found"
            });
        }
        return res.status(200).json({
            message: "Transaction deleted successfully",
        })

    } catch(error) {
        return res.status(500).json({
            message: "Failed to delete transaction",
            error: error.message
        });
    }
}

module.exports = { createTransaction, getTransaction, updateTransaction, deleteTransaction };
