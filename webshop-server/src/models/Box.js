const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
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
        type: String
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: null
    }],
    specialTypes: [{
        type: String,
        default: null
    }]
});

module.exports = mongoose.model('Box', boxSchema);