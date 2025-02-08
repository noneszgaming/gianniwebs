const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (!admin || !(await bcrypt.compare(req.body.password, admin.password))) {
            return res.status(401).send({ error: 'Invalid login credentials' });
        }
        
        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
        res.send({ admin, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
