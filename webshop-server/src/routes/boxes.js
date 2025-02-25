const express = require('express');
const router = express.Router();
const Box = require('../models/Box');
const auth = require('../middleware/auth');

// Új box létrehozása (Create)
router.post('/boxes', auth, async (req, res) => {
    try {
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

        const newBox = new Box(req.body);
        await newBox.save();
        res.status(201).send(newBox);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Összes box lekérése (Read)
router.get('/boxes', auth, async (req, res) => {
    try {
        const boxes = await Box.find().populate('items');
        res.status(200).send(boxes);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Egy adott box lekérése ID alapján (Read)
router.get('/boxes/:id', auth, async (req, res) => {
    try {
        const box = await Box.findById(req.params.id).populate('items');
        if (!box) {
            return res.status(404).send();
        }
        res.status(200).send(box);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Box frissítése (Update)
router.patch('/boxes/:id', auth, async (req, res) => {
    try {
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

        const box = await Box.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        }).populate('items');
        
        if (!box) {
            return res.status(404).send();
        }
        res.status(200).send(box);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Box törlése (Delete)
router.delete('/boxes/:id', auth, async (req, res) => {
    try {
        const box = await Box.findByIdAndDelete(req.params.id);
        if (!box) {
            return res.status(404).send();
        }
        res.status(200).send(box);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Publikus box lekérés - No auth required
router.get('/public/boxes', async (req, res) => {
    try {
        const boxes = await Box.find({ available: true }).populate('items');
        const boxesWithAllLangs = boxes.map(box => ({
            id: box._id,
            name: {
                hu: box.name.hu,
                en: box.name.en,
                de: box.name.de
            },
            price: box.price,
            description: {
                hu: box.description.hu,
                en: box.description.en,
                de: box.description.de
            },
            available: box.available,
            img: box.img,
            items: box.items,
            specialTypes: box.specialTypes
        }));
        res.status(200).send(boxesWithAllLangs);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
