const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Item = require('../models/Item');
const Address = require('../models/Address');
const SpecialType = require('../models/SpecialType');
const Box = require('../models/Box');

const auth = require('../middleware/auth');
const userAuth = require('../middleware/userAuth');
const User = require('../models/User');
const User_Address = require('../models/User_Address');

const axios = require('axios');

// PayPal configuration
const PAYPAL_API = 'https://sandbox.paypal.com'; 
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

// Public order creation endpoint
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
        
        // Item processing with specialTypes snapshots
        const itemPromises = req.body.items.map(async (item) => {
            const fullItem = await Item.findById(item._id);

            if (!fullItem) {
                // Try finding it as a box if item lookup fails
                const boxItem = await Box.findById(item._id);
  
                if (!boxItem) {
                    throw new Error(`Item or Box with ID ${item._id} not found`);
                }
  
                // Store complete specialType objects instead of just IDs
                const specialTypes = item.specialTypes ?
                    await SpecialType.find({ _id: { $in: item.specialTypes }}) :
                    [];
  
                return {
                    name: boxItem.name,
                    price: boxItem.price,
                    description: boxItem.description,
                    type: 'box',
                    quantity: item.quantity,
                    specialTypes: specialTypes.map(st => ({
                        _id: st._id,
                        name: st.name
                    }))
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
                specialTypes: specialTypes.map(st => ({
                    _id: st._id, 
                    name: st.name
                }))
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
              // A referencia mező
              addressReference: address._id,
              // Új snapshot mező
              addressSnapshot: {
                  originalId: address._id,
                  country: address.country,
                  city: address.city,
                  addressLine1: address.addressLine1,
                  addressLine2: address.addressLine2 || '',
                  zipCode: address.zipCode,
                  firstName: address.firstName || '',
                  lastName: address.lastName || ''
              },
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
  // Airbnb order creation endpoint - updated
  router.post('/orders/airbnb', userAuth, async (req, res) => {
      try {
          // Verify paymentId is provided
          if (!req.body.paymentId) {
              return res.status(400).send({
                  success: false,
                  message: 'Payment ID is required'
              });
          }
        
          const user = await User.findById(req.user._id).populate('address');
        
          // Check if subscription is expired
          const currentDate = new Date();
          if (currentDate > user.end_date) {
              return res.status(401).send({ error: 'User expired' });
          }

          // Update user with customer information if provided
          if (req.body.customer.name || req.body.customer.email || req.body.customer.phone) {
              const updateFields = {};
              if (req.body.customer.name) updateFields.name = req.body.customer.name;
              if (req.body.customer.email) updateFields.email = req.body.customer.email;
              if (req.body.customer.phone) updateFields.phone = req.body.customer.phone;
            
              await User.findByIdAndUpdate(user._id, updateFields);
          }

          // Handle Airbnb-specific address
          let addressId = user.address;  // Default to user's existing address
        
          // If new address is provided in the request, create or update it
          if (req.body.address) {
              let address;
            
              if (user.address) {
                  // Update existing address
                  address = await User_Address.findByIdAndUpdate(
                      user.address,
                      req.body.address,
                      { new: true }
                  );
              } else {
                  // Create new address
                  address = new User_Address({
                      ...req.body.address,
                      user: user._id
                  });
                  await address.save();
                
                  // Update user with the new address
                  await User.findByIdAndUpdate(user._id, { address: address._id });
                  addressId = address._id;
              }
          }

          // Process items for airbnb order - now allowing all item types
          const itemPromises = req.body.items.map(async (item) => {
              const fullItem = await Item.findById(item._id);

              if (!fullItem) {
                  // Try finding it as a box if item lookup fails
                  const boxItem = await Box.findById(item._id);
  
                  if (!boxItem) {
                      throw new Error(`Item or Box with ID ${item._id} not found`);
                  }
  
                  // Store complete specialType objects instead of just IDs
                  const specialTypes = item.specialTypes ?
                      await SpecialType.find({ _id: { $in: item.specialTypes }}) :
                      [];
  
                  return {
                      name: boxItem.name,
                      price: boxItem.price,
                      description: boxItem.description,
                      type: 'box',
                      quantity: item.quantity,
                      specialTypes: specialTypes.map(st => ({
                          _id: st._id,
                          name: st.name
                      }))
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
                  specialTypes: specialTypes.map(st => ({
                      _id: st._id, 
                      name: st.name
                  }))
              };
          });
        
          const completedItems = await Promise.all(itemPromises);

          const total_price = completedItems.reduce((total, item) => {
              return total + (Number(item.price) * Number(item.quantity));
          }, 0);
              // Az Airbnb végpontban, a fullAddress lekérdezés előtt
              // Győződjünk meg róla, hogy az addressId csak az ObjectId
              if (typeof addressId === 'object' && addressId._id) {
                addressId = addressId._id;
              }

              // Majd a lekérdezés
              let fullAddress;
              try {
                fullAddress = await User_Address.findById(addressId);
                
                if (!fullAddress) {
                  return res.status(404).send({
                    success: false,
                    message: 'Address not found'
                  });
                }
              } catch (error) {
                console.error('Error fetching address:', error);
                return res.status(500).send({
                  success: false,
                  message: 'Error fetching address data',
                  error: error.message
                });
              }

              // A rendelés létrehozásakor
              const order = new Order({
                paymentId: req.body.paymentId,
                order_type: 'airbnb',
                items: completedItems,
                total_price: total_price,
                user: user._id,
                addressModel: 'User_Address',
                addressReference: addressId,
                addressSnapshot: {
                  originalId: addressId,
                  country: fullAddress.country || 'Hungary',
                  city: fullAddress.city,
                  addressLine1: fullAddress.addressLine1,
                  addressLine2: fullAddress.addressLine2 || '',
                  zipCode: fullAddress.zipCode,
                  firstName: fullAddress.firstName || '',
                  lastName: fullAddress.lastName || ''
                },
                order_note: req.body.note,
                deliveryDate: req.body.deliveryDate ? new Date(req.body.deliveryDate) : new Date(),
                deliveryTime: req.body.deliveryTime,
                status: 'pending'
              });              await order.save();
          res.status(201).send({
              success: true,
              message: 'Airbnb order created successfully',
              order: order
          });
      } catch (error) {
          res.status(400).send({ 
              success: false,
              message: 'Error creating Airbnb order',
              error: error.message 
          });
      }
  });
// Get all orders endpoint - adjusted to populate user for airbnb orders
router.get('/orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('customer')
            .populate('user')
            .populate('addressReference')  // Updated field name
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

// Verify payment endpoint
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
            )
            .populate('customer')
            .populate('user')
            .populate('address');

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

module.exports = router;