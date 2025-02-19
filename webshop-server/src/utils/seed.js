require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Generate random base64 image
const generateRandomBase64Image = () => {
    const width = 100;
    const height = 100;
    const buffer = Buffer.alloc(width * height * 4);
    
    for (let i = 0; i < buffer.length; i += 4) {
        buffer[i] = Math.random() * 255;     // R
        buffer[i + 1] = Math.random() * 255; // G
        buffer[i + 2] = Math.random() * 255; // B
        buffer[i + 3] = 255;                 // A
    }
    
    return `data:image/png;base64,${buffer.toString('base64')}`;
};

const seedItems = [
    // Merch items
    {
        name: {
            hu: 'Bögre',
            en: 'Mug',
            de: 'Tasse'
        },
        price: 10,
        description: {
            hu: 'Kávés bögre',
            en: 'Coffee Mug',
            de: 'Kaffeetasse'
        },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },
    {
        name: {
            hu: 'Matrica csomag',
            en: 'Sticker Pack',
            de: 'Aufkleber-Set'
        },
        price: 5,
        description: {
            hu: 'Matrica készlet',
            en: 'Set of Stickers',
            de: 'Aufkleber-Sammlung'
        },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },

    // Food items
    {
        name: {
            hu: 'Pizza',
            en: 'Pizza',
            de: 'Pizza'
        },
        price: 10,
        description: {
            hu: 'Ízletes pizza',
            en: 'Delicious Pizza',
            de: 'Köstliche Pizza'
        },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    },
    {
        name: {
            hu: 'Hamburger',
            en: 'Burger',
            de: 'Hamburger'
        },
        price: 8,
        description: {
            hu: 'Szaftos hamburger',
            en: 'Juicy Burger',
            de: 'Saftiger Hamburger'
        },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    }
];

const defaultAdmin = {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 8)
};

const seedDatabase = async () => {
    try {
        await Item.insertMany(seedItems);
        await Admin.create(defaultAdmin);
        console.log('Database seeded successfully with multilingual items and default admin.');
        console.log('Admin credentials - Username: admin, Password: admin123');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();