const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Item = require('../models/Item');
const Address = require('../models/Address');
const SpecialType = require('../models/SpecialType');
const Box = require('../models/Box');

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
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const tokenResponse = await axios({
        method: 'post',
        url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials'
    });

    paypalAccessToken = tokenResponse.data.access_token;
    tokenExpiryTime = Date.now() + (30000 * 1000);
    
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

        // Existing customer logic
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

        // Existing address logic
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
          // Enhanced item processing with special types
          const itemPromises = req.body.items.map(async (item) => {
            const fullItem = await Item.findById(item._id);
            
            if (!fullItem) {
                // Try finding it as a box if item lookup fails
                const boxItem = await Box.findById(item._id);
                
                if (!boxItem) {
                    throw new Error(`Item or Box with ID ${item._id} not found`);
                }
                
                // Process specialTypes for boxes too, just like for regular items
                const specialTypes = item.specialTypes ?
                    await SpecialType.find({ _id: { $in: item.specialTypes }}) :
                    [];
                
                return {
                    name: boxItem.name,
                    price: boxItem.price,
                    description: boxItem.description,
                    type: 'box',
                    quantity: item.quantity,
                    specialTypes: specialTypes.map(st => st._id) // Add this line for boxes too
                };
            }
            
            const specialTypes = item.specialTypes ?
                await SpecialType.find({ _id: { $in: item.specialTypes }}) :
                [];
            
            return {
                name: fullItem.name,
                price: fullItem.price,
                description: fullItem.description,
                type: fullItem.type,
                quantity: item.quantity,
                specialTypes: specialTypes.map(st => st._id)
            };
        });
        
        const completedItems = await Promise.all(itemPromises);

        const total_price = completedItems.reduce((total, item) => {
            return total + (Number(item.price) * Number(item.quantity));
        }, 0);

        const order = new Order({
            paymentId: req.body.paymentId,
            order_type: req.body.order_type,
            items: completedItems,
            total_price: total_price,
            customer: customer._id,
            address: address._id,
            order_note: req.body.note,
            
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
            .populate('items.specialTypes')
            .sort({ created_date: -1 });

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
