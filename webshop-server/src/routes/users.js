const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).send({ error: 'Invalid login credentials' });
        }

        // Check if subscription is expired
        const currentDate = new Date();
        if (currentDate > user.end_date) {
            return res.status(401).send({ error: 'Subscription expired' });
        }
       
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/user/verify', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Check if subscription is expired
        const currentDate = new Date();
        if (currentDate > user.end_date) {
            return res.status(401).send({ error: 'Subscription expired' });
        }

        res.status(200).send({ verified: true });
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
});

module.exports = router;
