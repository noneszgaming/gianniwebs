const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Item = require('../models/Item');
const Address = require('../models/Address');
const auth = require('../middleware/auth');

router.post('/orders', async (req, res) => {
    try {
        // 1. Check if customer exists by email
        let customer = await Customer.findOne({ email: req.body.customer.email });
        
        // If customer doesn't exist, create new one
        if (!customer) {
            customer = new Customer({
                name: req.body.customer.name,
                email: req.body.customer.email,
                phone: req.body.customer.phone
            });
            await customer.save();
        }

        // 2. Check if address exists for this customer
        let address = await Address.findOne({
            customer: customer._id,
            country: req.body.address.country,
            firstName: req.body.address.firstName,
            lastName: req.body.address.lastName,
            city: req.body.address.city,
            addressLine1: req.body.address.addressLine1,
            addressLine2: req.body.address.addressLine2,
            zipCode: req.body.address.zipCode
        });

        // If address doesn't exist, create new one
        if (!address) {
            address = new Address({
                customer: customer._id,
                country: req.body.address.country,
                firstName: req.body.address.firstName,
                lastName: req.body.address.lastName,
                city: req.body.address.city,
                addressLine1: req.body.address.addressLine1,
                addressLine2: req.body.address.addressLine2,
                zipCode: req.body.address.zipCode
            });
            await address.save();
        }

        // 3. Create order with item snapshots and address reference
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

        const order = new Order({
            customer: customer._id,
            items: orderItems,
            status: 'pending',
            created_date: new Date(),
            address: address._id
        });
        await order.save();

        const populatedOrder = await Order.findById(order._id)
            .populate('customer')
            .populate('address')
            .exec();

        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.get('/orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('customer')
            .populate('address')
            .sort({ created_date: -1 }); // Most recent first

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
});


module.exports = router;
