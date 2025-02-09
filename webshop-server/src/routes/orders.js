const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Item = require('../models/Item');

router.post('/order', async (req, res) => {
    try {
        // Check if customer exists by email
        let customer = await Customer.findOne({ email: req.body.customer.email });
        
        // If customer doesn't exist, create new one
        if (!customer) {
            customer = new Customer({
                name: req.body.customer.name,
                email: req.body.customer.email,
                address: req.body.customer.address
            });
            await customer.save();
        }

        // Transform cart items into order items with snapshots
        const orderItems = await Promise.all(req.body.items.map(async (cartItem) => {
            const item = await Item.findById(cartItem._id);
            return {
                name: item.name,
                price: item.price,
                description: item.description,
                type: item.type,
                quantity: cartItem.quantity
            };
        }));

        // Create order with item snapshots
        const order = new Order({
            customer: customer._id,
            items: orderItems,
            status: 'pending',
            created_date: new Date(),
            address: req.body.address
        });
        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate('customer');

        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
