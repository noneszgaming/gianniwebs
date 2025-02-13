const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Item = require('../models/Item');
const Address = require('../models/Address');
const auth = require('../middleware/auth');

const axios = require('axios'); // Add this for HTTP requests

// Add PayPal configuration
const PAYPAL_API = 'https://sandbox.paypal.com'; // Use sandbox URL for testing
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// Helper function to verify PayPal payment
async function verifyPayPalPayment(paymentId) {
    try {
        // Get access token
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
        const tokenResponse = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        // Verify payment
        const response = await axios.get(`${PAYPAL_API}/v2/checkout/orders/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${tokenResponse.data.access_token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.status === 'COMPLETED';
    } catch (error) {
        console.error('PayPal verification error:', error);
        return false;
    }
}

router.post('/orders', async (req, res) => {
    try {
        const isPaymentValid = await verifyPayPalPayment(req.body.paymentId);
        
        if (!isPaymentValid) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }
        // Create/update customer
        let customer = await Customer.findOne({ email: req.body.customer.email });
        if (!customer) {
            customer = new Customer({
                name: req.body.customer.name,
                email: req.body.customer.email,
                phone: req.body.customer.phone,
                termsAccepted: req.body.termsAccepted,
                termsAcceptedDate: new Date()
            });
            await customer.save();
        }

        // Create/update address
        let address = await Address.findOne({
            customer: customer._id,
            country: req.body.address.country,
            city: req.body.address.city,
            addressLine1: req.body.address.addressLine1
        });

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

        // Fetch complete item details
        const itemPromises = req.body.items.map(async (item) => {
            const fullItem = await Item.findById(item._id);
            return {
                name: fullItem.name,
                price: fullItem.price,
                description: fullItem.description,
                type: fullItem.type,
                quantity: item.quantity
            };
        });
        const completedItems = await Promise.all(itemPromises);

        // Create order with all required fields
        const order = new Order({
            paymentId: req.body.paymentId,
            items: completedItems,
            customer: customer._id,
            address: address._id,
            isInstantDelivery: req.body.isInstantDelivery,
            deliveryDate: req.body.isInstantDelivery ? new Date() : new Date(req.body.deliveryDate),
            deliveryTime: req.body.isInstantDelivery ? null : req.body.deliveryTime,
            status: 'Paid'
        });

        await order.save();
        res.status(201).json(order);

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: error.message });
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
