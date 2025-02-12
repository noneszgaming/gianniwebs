const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const auth = require('../middleware/auth');

router.post('/setState', auth, async (req, res) => {
    try {
        const { state } = req.body;
        const store = await Store.findOne() || new Store();
        store.state = state;
        store.lastUpdated = new Date();
        await store.save();
        
        res.status(200).json({ 
            success: true,
            message: `Store ${state} successfully`, 
            store 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error changing store state', 
            error: error.message 
        });
    }
});

// Get current store state
router.get('/state', async (req, res) => {
    try {
        const store = await Store.findOne();
        res.status(200).json({ 
            state: store ? store.state : 'closed' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching store state', 
            error: error.message 
        });
    }
});

module.exports = router;
