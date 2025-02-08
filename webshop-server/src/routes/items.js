const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Új item létrehozása (Create)
router.post('/items', auth, async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).send(newItem);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Összes item lekérése (Read)
router.get('/items', auth, async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Egy adott item lekérése ID alapján (Read)
router.get('/items/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Item frissítése (Update)
router.patch('/items/:id', auth, async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Item törlése (Delete)
router.delete('/items/:id', auth, async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Összes étel lekérése (food) - No auth required
router.get('/food', async (req, res) => {
    try {
        const foodItems = await Item.find({ type: 'food' });
        res.status(200).send(foodItems);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Összes merch lekérése (merch) - No auth required
router.get('/merch', async (req, res) => {
    try {
        const merchItems = await Item.find({ type: 'merch' });
        res.status(200).send(merchItems);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
