const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const {
  getMonthlyStats,
  recommendBudget,
  detectOverspending,
} = require("../utils/insightsHelper");

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const transactions = await Transaction.find({ userId }).sort({ date: 1 });

    const monthlyStats = getMonthlyStats(transactions);
    const budget = recommendBudget(monthlyStats);
    const currentMonth = new Date().getMonth();
    const alerts = detectOverspending(transactions, currentMonth);

    res.json({
      recommendedBudget: budget,
      alerts,
      monthlyStats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
