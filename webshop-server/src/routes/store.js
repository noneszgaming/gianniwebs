const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const auth = require('../middleware/auth');

const storeRouter = (wsService) => {
    router.post('/setState', auth, async (req, res) => {
        try {
            const { state, type } = req.body;
            const store = await Store.findOne({ type }) || new Store({ type });
            store.state = state;
            store.lastUpdated = new Date();
            await store.save();
            
            // Broadcast to all connected clients with store type
            console.log('Broadcasting new state:', state, 'for type:', type);
            wsService.broadcastStoreStatus({
                type: 'STORE_STATUS_UPDATE',
                state: store.state,
                storeType: store.type
            });
            
            res.status(200).json({ 
                success: true,
                message: `Store ${type} ${state} successfully`, 
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

    router.get('/state', async (req, res) => {
        try {
            const { type } = req.query;
            let stores;
            
            if (type) {
                // If type is specified, return specific store
                const store = await Store.findOne({ type });
                stores = { [type]: store ? store.state : 'closed' };
            } else {
                // Return both store types
                const publicStore = await Store.findOne({ type: 'public' });
                const airbnbStore = await Store.findOne({ type: 'airbnb' });
                
                stores = {
                    public: publicStore ? publicStore.state : 'closed',
                    airbnb: airbnbStore ? airbnbStore.state : 'closed'
                };
            }

            res.status(200).json(stores);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error fetching store states', 
                error: error.message 
            });
        }
    });

    return router;
};

module.exports = storeRouter;