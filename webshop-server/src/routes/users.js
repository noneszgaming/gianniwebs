const express = require('express');
const router = express.Router();
const User = require('../models/User');
const User_Address = require('../models/User_Address');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const userAuth = require('../middleware/userAuth');

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        
        if (!user || req.body.password !== user.password) {
            return res.status(401).send({ error: 'Invalid login credentials' });
        }

        // Check if subscription is expired
        const currentDate = new Date();
        if (currentDate > user.end_date) {
            return res.status(401).send({ error: 'User expired' });
        }
       
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        
        // Populate the address information
        await user.populate('address');
        
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/user/verify', userAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('address');
        
        // Check if subscription is expired
        const currentDate = new Date();
        if (currentDate > user.end_date) {
            return res.status(401).send({ error: 'User expired' });
        }

        res.status(200).send({ verified: true, user });
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
});

router.post('/user/create', auth, async (req, res) => {
    try {
        const randomUsername = Math.floor(10000 + Math.random() * 90000).toString();
        const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
        
        let addressId = null;
        
        // If address ID is provided, verify it exists
        if (req.body.addressId) {
            const address = await User_Address.findById(req.body.addressId);
            if (!address) {
                return res.status(404).json({
                    success: false,
                    message: 'Address not found'
                });
            }
            addressId = req.body.addressId;
        }

        const user = new User({
            username: randomUsername,
            password: randomPassword,
            end_date: new Date(req.body.end_date),
            start_date: new Date(req.body.start_date),
            created_at: new Date(),
            address: addressId
        });

        await user.save();

        // If we want to return user with populated address
        const populatedUser = await User.findById(user._id).populate('address');

        res.status(201).send({
            success: true,
            message: 'User created successfully',
            credentials: {
                username: randomUsername,
                password: randomPassword,
                end_date: req.body.end_date,
                start_date: req.body.start_date,
                address: populatedUser.address
            }
        });

    } catch (error) {
        res.status(400).send({ 
            success: false,
            message: 'Error creating user',
            error: error.message 
        });
    }
});

router.get('/users/all', auth, async (req, res) => {
    try {
        const users = await User.find({}).populate('address');
        
        const formattedUsers = users.map(user => ({
            id: user._id,
            username: user.username,
            password: user.password,
            end_date: user.end_date,
            start_date: user.start_date,
            address: user.address,
            name: user.name || ' ',
            email: user.email || ' ',
            phone: user.phone || ' '
        }));

        res.status(200).send({
            success: true,
            count: formattedUsers.length,
            users: formattedUsers
        });
    } catch (error) {
        res.status(500).send({ 
            success: false,
            message: 'Error fetching users',
            error: error.message 
        });
    }
});

router.delete('/user/:id', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).send({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.status(200).send({ 
            success: true,
            message: 'User deleted successfully',
            deletedUser: {
                username: user.username,
                end_date: user.end_date
            }
        });
    } catch (error) {
        res.status(500).send({ 
            success: false,
            message: 'Error deleting user',
            error: error.message 
        });
    }
});

module.exports = router;