const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
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