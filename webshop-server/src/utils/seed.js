const mongoose = require('mongoose');
const Item = require('../models/Item');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
// MongoDB kapcsolat
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Adatok definiálása
const seedItems = [
    // 10 merch
    { name: 'T-Shirt', price: 20, description: 'Cool T-Shirt', available: true, img: 'tshirt.jpg', type: 'merch' },
    { name: 'Hoodie', price: 40, description: 'Warm Hoodie', available: true, img: 'hoodie.jpg', type: 'merch' },
    { name: 'Cap', price: 15, description: 'Stylish Cap', available: true, img: 'cap.jpg', type: 'merch' },
    { name: 'Mug', price: 10, description: 'Coffee Mug', available: true, img: 'mug.jpg', type: 'merch' },
    { name: 'Sticker Pack', price: 5, description: 'Set of Stickers', available: true, img: 'stickers.jpg', type: 'merch' },
    { name: 'Poster', price: 12, description: 'Decorative Poster', available: true, img: 'poster.jpg', type: 'merch' },
    { name: 'Tote Bag', price: 8, description: 'Eco-friendly Bag', available: true, img: 'tote.jpg', type: 'merch' },
    { name: 'Keychain', price: 3, description: 'Cute Keychain', available: true, img: 'keychain.jpg', type: 'merch' },
    { name: 'Notebook', price: 7, description: 'Simple Notebook', available: true, img: 'notebook.jpg', type: 'merch' },
    { name: 'Pen', price: 2, description: 'Black Pen', available: true, img: 'pen.jpg', type: 'merch' },

    // 10 food
    { name: 'Pizza', price: 10, description: 'Delicious Pizza', available: true, img: 'pizza.jpg', type: 'food' },
    { name: 'Burger', price: 8, description: 'Juicy Burger', available: true, img: 'burger.jpg', type: 'food' },
    { name: 'Pasta', price: 12, description: 'Creamy Pasta', available: true, img: 'pasta.jpg', type: 'food' },
    { name: 'Salad', price: 6, description: 'Fresh Salad', available: true, img: 'salad.jpg', type: 'food' },
    { name: 'Sushi', price: 15, description: 'Japanese Sushi', available: true, img: 'sushi.jpg', type: 'food' },
    { name: 'Taco', price: 5, description: 'Spicy Taco', available: true, img: 'taco.jpg', type: 'food' },
    { name: 'Ice Cream', price: 4, description: 'Sweet Ice Cream', available: true, img: 'icecream.jpg', type: 'food' },
    { name: 'Sandwich', price: 7, description: 'Classic Sandwich', available: true, img: 'sandwich.jpg', type: 'food' },
    { name: 'Soup', price: 5, description: 'Hot Soup', available: true, img: 'soup.jpg', type: 'food' },
    { name: 'Steak', price: 20, description: 'Grilled Steak', available: true, img: 'steak.jpg', type: 'food' }
];

const defaultAdmin = {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 8)
};
// Adatok beszúrása az adatbázisba
const seedDatabase = async () => {
    try {

        // Beszúrjuk az új adatokat
        await Item.insertMany(seedItems);
        await Admin.create(defaultAdmin);
        console.log('Database seeded successfully with items and default admin.');
        console.log('Admin credentials - Username: admin, Password: admin123');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Kapcsolat bezárása
        mongoose.connection.close();
    }
};

// Seeder futtatása
seedDatabase();