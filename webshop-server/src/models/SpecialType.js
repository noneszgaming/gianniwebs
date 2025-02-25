const mongoose = require('mongoose');

const specTypeSchema = new mongoose.Schema({
    name: {
        hu: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        },
        de: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('SpecialType', specTypeSchema);
