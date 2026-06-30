const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get monthly summary
router.get('/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const summary = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" }
        }
      }
    ]);

    const formattedSummary = {
      income: 0,
      expense: 0,
      breakdown: []
    };

    summary.forEach(item => {
      if (item._id.type === 'income') {
        formattedSummary.income += item.total;
      } else {
        formattedSummary.expense += item.total;
        formattedSummary.breakdown.push({
          category: item._id.category,
          amount: item.total
        });
      }
    });

    res.json(formattedSummary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
