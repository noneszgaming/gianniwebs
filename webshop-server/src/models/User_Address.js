const mongoose = require('mongoose');

const user_addressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        required: false
    },
    zipCode: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User_Address', user_addressSchema);
