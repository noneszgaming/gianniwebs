const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Új item létrehozása (Create)
router.post('/items', auth, async (req, res) => {
    try {
        // Ellenőrizzük, hogy minden nyelvi verzió megvan-e
        const requiredLanguages = ['hu', 'en', 'de'];
        const hasAllLanguages = requiredLanguages.every(lang => 
            req.body.name?.[lang] && 
            req.body.description?.[lang]
        );

        if (!hasAllLanguages) {
            return res.status(400).send({ 
                error: 'All language versions (hu, en, de) are required for name and description' 
            });
        }

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
        // Ha van name vagy description a kérésben, ellenőrizzük a nyelvi verziókat
        if (req.body.name || req.body.description) {
            const requiredLanguages = ['hu', 'en', 'de'];
            const hasValidLanguages = requiredLanguages.every(lang => {
                if (req.body.name) return req.body.name[lang];
                if (req.body.description) return req.body.description[lang];
                return true;
            });

            if (!hasValidLanguages) {
                return res.status(400).send({ 
                    error: 'If updating name or description, all language versions (hu, en, de) must be provided' 
                });
            }
        }

        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        
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
        const foodItemsWithAllLangs = foodItems.map(item => ({
            id: item._id,
            name: {
                hu: item.name.hu,
                en: item.name.en,
                de: item.name.de
            },
            price: item.price,
            description: {
                hu: item.description.hu,
                en: item.description.en,
                de: item.description.de
            },
            available: item.available,
            img: item.img,
            type: item.type
        }));
        res.status(200).send(foodItemsWithAllLangs);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Összes merch lekérése (merch) - No auth required
router.get('/merch', async (req, res) => {
    try {
        const merchItems = await Item.find({ type: 'merch' });
        const merchItemsWithAllLangs = merchItems.map(item => ({
            id: item._id,
            name: {
                hu: item.name.hu,
                en: item.name.en,
                de: item.name.de
            },
            price: item.price,
            description: {
                hu: item.description.hu,
                en: item.description.en,
                de: item.description.de
            },
            available: item.available,
            img: item.img,
            type: item.type
        }));
        res.status(200).send(merchItemsWithAllLangs);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
