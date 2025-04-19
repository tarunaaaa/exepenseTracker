const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

// ➤ Add Transaction (Income/Expense)
router.post("/", async (req, res) => {
    try {
        const { name, amount, type, email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const newTransaction = new Transaction({ name, amount, type, email });
        await newTransaction.save();
        res.status(201).json({ message: "Transaction added", transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ➤ Get All Transactions for Logged-in User
router.get("/", async (req, res) => {
    try {
        const email = req.query.email;  // Get email from query params
        if (!email) return res.status(400).json({ message: "Email is required" });

        const transactions = await Transaction.find({ email }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ➤ Get Transactions by Type (Income or Expense) for Logged-in User
router.get("/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const email = req.query.email;  // Get email from query params
        if (!email) return res.status(400).json({ message: "Email is required" });

        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({ message: "Invalid transaction type" });
        }

        const transactions = await Transaction.find({ email, type }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ➤ Update a Transaction (Only if it belongs to the logged-in user)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount, type, email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: id, email }, // Ensure the transaction belongs to the user
            { name, amount, type },
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found or not authorized" });
        }

        res.json({ message: "Transaction updated", transaction: updatedTransaction });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ➤ Delete a Transaction (Only if it belongs to the logged-in user)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.query.email;  // Get email from query params
        if (!email) return res.status(400).json({ message: "Email is required" });

        const deletedTransaction = await Transaction.findOneAndDelete({ _id: id, email });

        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found or not authorized" });
        }

        res.json({ message: "Transaction deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
