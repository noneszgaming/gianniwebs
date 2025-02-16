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
let paypalAccessToken = null;
let tokenExpiryTime = null;

async function getPayPalAccessToken() {
    // Check if we have a valid token
    if (paypalAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
        return paypalAccessToken;
    }

    // Get new token if none exists or expired
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

    // Store token and set expiry (typically 32000 seconds, setting to 30000 for safety)
    paypalAccessToken = tokenResponse.data.access_token;
    tokenExpiryTime = Date.now() + (30000 * 1000); // Convert seconds to milliseconds
    
    return paypalAccessToken;
}

async function verifyPayPalPayment(paymentId) {
    try {
        const accessToken = await getPayPalAccessToken();
        
        const response = await axios.get(`${PAYPAL_API}/v2/checkout/orders/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
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
        
        const orderStatus = isPaymentValid ? 'Paid' : 'pending';
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

        // Calculate total price
        const total_price = completedItems.reduce((total, item) => {
            return total + (Number(item.price) * Number(item.quantity));
        }, 0);
        // Create order with all required fields including total_price
        const order = new Order({
            paymentId: req.body.paymentId,
            items: completedItems,
            total_price: total_price, // This will add the total_price to the response
            customer: customer._id,
            address: address._id,
            isInstantDelivery: req.body.isInstantDelivery,
            deliveryDate: req.body.isInstantDelivery ? new Date() : new Date(req.body.deliveryDate),
            deliveryTime: req.body.isInstantDelivery ? null : req.body.deliveryTime,
            status: orderStatus
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

router.post('/orders/verify/:paymentId', auth, async (req, res) => {
    try {
        const paymentId = req.params.paymentId;
        const isPaymentValid = await verifyPayPalPayment(paymentId);

        if (isPaymentValid) {
            // Update order status to 'Paid' if payment is valid
            const updatedOrder = await Order.findOneAndUpdate(
                { paymentId: paymentId },
                { status: 'Paid' },
                { new: true }
            ).populate('customer').populate('address');

            if (!updatedOrder) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                order: updatedOrder
            });
        }

        res.status(400).json({
            success: false,
            message: 'Payment verification failed'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
});
