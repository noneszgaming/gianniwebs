const express = require('express');
const router = express.Router();
const SpecialType = require('../models/SpecialType');
const auth = require('../middleware/auth');

// Create new special type
router.post('/specialtypes', auth, async (req, res) => {
    try {
        const requiredLanguages = ['hu', 'en', 'de'];
        const hasAllLanguages = requiredLanguages.every(lang => 
            req.body.name?.[lang]
        );

        if (!hasAllLanguages) {
            return res.status(400).send({ 
                error: 'All language versions (hu, en, de) are required for name' 
            });
        }

        const newSpecialType = new SpecialType(req.body);
        await newSpecialType.save();
        res.status(201).send(newSpecialType);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all special types
router.get('/specialtypes', auth, async (req, res) => {
    try {
        const specialTypes = await SpecialType.find();
        res.status(200).send(specialTypes);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get specific special type by ID
router.get('/specialtypes/:id', auth, async (req, res) => {
    try {
        const specialType = await SpecialType.findById(req.params.id);
        if (!specialType) {
            return res.status(404).send();
        }
        res.status(200).send(specialType);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update special type
router.patch('/specialtypes/:id', auth, async (req, res) => {
    try {
        if (req.body.name) {
            const requiredLanguages = ['hu', 'en', 'de'];
            const hasValidLanguages = requiredLanguages.every(lang => 
                req.body.name[lang]
            );

            if (!hasValidLanguages) {
                return res.status(400).send({ 
                    error: 'All language versions (hu, en, de) must be provided' 
                });
            }
        }

        const specialType = await SpecialType.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        
        if (!specialType) {
            return res.status(404).send();
        }
        res.status(200).send(specialType);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete special type
router.delete('/specialtypes/:id', auth, async (req, res) => {
    try {
        const specialType = await SpecialType.findByIdAndDelete(req.params.id);
        if (!specialType) {
            return res.status(404).send();
        }
        res.status(200).send(specialType);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Public endpoint for special types
router.get('/public/specialtypes', async (req, res) => {
    try {
        const specialTypes = await SpecialType.find();
        const typesWithAllLangs = specialTypes.map(type => ({
            id: type._id,
            name: {
                hu: type.name.hu,
                en: type.name.en,
                de: type.name.de
            }
        }));
        res.status(200).send(typesWithAllLangs);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
