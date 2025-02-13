const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    termsAccepted: {
        type: Boolean,
        required: true
    },
    termsAcceptedDate: {
        type: Date,
        required: true
    }

});

module.exports = mongoose.model('Customer', customerSchema);