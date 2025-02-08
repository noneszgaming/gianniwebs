const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Új rendelés létrehozása
router.post('/', async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.status(201).json(newOrder);
});

// Összes rendelés lekérése
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('customer').populate('items.item');
  res.json(orders);
});

module.exports = router;