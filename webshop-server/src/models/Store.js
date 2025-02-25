const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    state: {
        type: String,
        enum: ['open', 'closed'],
        required: true,
        default: 'closed'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum:['public', 'airbnb'],
        required: true,
        default: 'public'
    }
});

module.exports = mongoose.model('Store', storeSchema);
