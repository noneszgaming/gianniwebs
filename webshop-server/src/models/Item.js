const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
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
    },
    price: {
        type: Number,
        required: true
    },
    description: {
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
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['food', 'merch'],
        required: true
    }
});

module.exports = mongoose.model('Item', itemSchema);
