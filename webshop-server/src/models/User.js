const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    end_date: {
        type: Date,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Address',
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);