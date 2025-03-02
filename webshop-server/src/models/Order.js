const mongoose = require('mongoose');

// Define a schema for the specialType snapshot
const specialTypeSnapshotSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
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
}, { _id: false });

// Új schema a cím adatok tárolásához
const addressSnapshotSchema = new mongoose.Schema({
    originalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    country: {
        type: String,
        default: 'Hungary'
    },
    city: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    zipCode: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    order_type: {
        type: String,
        enum: ['public', 'airbnb'],
        required: true
    },
    items: [{
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
        type: {
            type: String,
            enum: ['food', 'merch', 'box'],
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        specialTypes: [specialTypeSnapshotSchema]
    }],
    total_price: {
        type: Number,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'Paid']
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: function() {
            return this.order_type === 'public';
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() {
            return this.order_type === 'airbnb';
        }
    },
    // Ezt a részt cseréljük
    addressModel: {
        type: String,
        enum: ['User_Address', 'Address'],
        default: function() {
            return this.order_type === 'airbnb' ? 'User_Address' : 'Address';
        }
    },
    addressReference: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'addressModel'
    },
    // Új mező a cím adatok tárolásához
    addressSnapshot: {
        type: addressSnapshotSchema,
        required: true
    },
    order_note: {
        type: String,
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    deliveryTime: {
        type: String
    },
    orderValidation: {
        type: Boolean,
        default: function() {
            if (this.order_type === 'airbnb') {
                return this.items.every(item => ['box', 'merch'].includes(item.type));
            }
            return this.items.every(item => ['food', 'merch'].includes(item.type));
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);