const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add or Update budget
router.post('/', async (req, res) => {
  const { category, limit } = req.body;
  try {
    let budget = await Budget.findOne({ category });
    if (budget) {
      budget.limit = limit;
      await budget.save();
    } else {
      budget = new Budget({ category, limit });
      await budget.save();
    }
    res.status(200).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
