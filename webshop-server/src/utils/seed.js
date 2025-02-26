require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');
const Admin = require('../models/Admin');
const Box = require('../models/Box');
const SpecialType = require('../models/SpecialType');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Better base64 image generation
const generateRandomBase64Image = () => {
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBaRXhpZgAATU0AKgAAAAgABQMBAAUAAAABAAAASgMDAAEAAAABAAAAAFEQAAEAAAABAQAAAFERAAQAAAABAAAOxFESAAQAAAABAAAOxAAAAAAAAYagAACxj//bAEMAAgEBAgEBAgICAgICAgIDBQMDAwMDBgQEAwUHBgcHBwYHBwgJCwkICAoIBwcKDQoKCwwMDAwHCQ4PDQwOCwwMDP/bAEMBAgICAwMDBgMDBgwIBwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAGQAZAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/2gAMAwEAAhEDEQA/APn+iiiv9fT/ACCQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/2Q==';
};

const seedItems = [
    // Merch items
    {
        name: { hu: 'Bögre', en: 'Mug', de: 'Tasse' },
        price: 1000,
        description: { hu: 'Kávés bögre', en: 'Coffee Mug', de: 'Kaffeetasse' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },
    {
        name: { hu: 'Póló', en: 'T-Shirt', de: 'T-Shirt' },
        price: 2500,
        description: { hu: 'Pamut póló', en: 'Cotton T-Shirt', de: 'Baumwoll T-Shirt' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },
    {
        name: { hu: 'Sapka', en: 'Cap', de: 'Kappe' },
        price: 1500,
        description: { hu: 'Baseball sapka', en: 'Baseball Cap', de: 'Baseball Kappe' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },
    {
        name: { hu: 'Kulcstartó', en: 'Keychain', de: 'Schlüsselanhänger' },
        price: 500,
        description: { hu: 'Fém kulcstartó', en: 'Metal Keychain', de: 'Metall Schlüsselanhänger' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },
    {
        name: { hu: 'Hátizsák', en: 'Backpack', de: 'Rucksack' },
        price: 3500,
        description: { hu: 'Vízálló hátizsák', en: 'Waterproof Backpack', de: 'Wasserdichter Rucksack' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },
    {
        name: { hu: 'Tolltartó', en: 'Pencil Case', de: 'Federmäppchen' },
        price: 800,
        description: { hu: 'Cipzáras tolltartó', en: 'Zipper Pencil Case', de: 'Reißverschluss Federmäppchen' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },
    {
        name: { hu: 'Jegyzetfüzet', en: 'Notebook', de: 'Notizbuch' },
        price: 700,
        description: { hu: 'Spirál jegyzetfüzet', en: 'Spiral Notebook', de: 'Spiral Notizbuch' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },
    {
        name: { hu: 'Egérpad', en: 'Mousepad', de: 'Mauspad' },
        price: 1200,
        description: { hu: 'Gaming egérpad', en: 'Gaming Mousepad', de: 'Gaming Mauspad' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },
    {
        name: { hu: 'Telefontok', en: 'Phone Case', de: 'Handyhülle' },
        price: 1500,
        description: { hu: 'Védő telefontok', en: 'Protective Phone Case', de: 'Schützende Handyhülle' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },
    {
        name: { hu: 'Matrica készlet', en: 'Sticker Set', de: 'Aufkleber-Set' },
        price: 600,
        description: { hu: 'Vinyl matrica készlet', en: 'Vinyl Sticker Set', de: 'Vinyl Aufkleber-Set' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'merch'
    },

    // Food items
    {
        name: { hu: 'Margherita Pizza', en: 'Margherita Pizza', de: 'Margherita Pizza' },
        price: 1200,
        description: { hu: 'Klasszikus olasz pizza', en: 'Classic Italian Pizza', de: 'Klassische Italienische Pizza' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    },
    {
        name: { hu: 'Sajtburger', en: 'Cheeseburger', de: 'Cheeseburger' },
        price: 900,
        description: { hu: 'Dupla sajtos burger', en: 'Double Cheese Burger', de: 'Doppel Käse Burger' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    },
    {
        name: { hu: 'Cézár Saláta', en: 'Caesar Salad', de: 'Caesar Salat' },
        price: 800,
        description: { hu: 'Friss cézár saláta', en: 'Fresh Caesar Salad', de: 'Frischer Caesar Salat' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    },
    {
        name: { hu: 'Sült Krumpli', en: 'French Fries', de: 'Pommes Frites' },
        price: 400,
        description: { hu: 'Ropogós sült krumpli', en: 'Crispy French Fries', de: 'Knusprige Pommes Frites' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    },
    {
        name: { hu: 'Nachos', en: 'Nachos', de: 'Nachos' },
        price: 700,
        description: { hu: 'Sajtos nachos', en: 'Cheese Nachos', de: 'Käse Nachos' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    },
    {
        name: { hu: 'Hot Dog', en: 'Hot Dog', de: 'Hot Dog' },
        price: 600,
        description: { hu: 'Klasszikus hot dog', en: 'Classic Hot Dog', de: 'Klassischer Hot Dog' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    },
    {
        name: { hu: 'Wrap', en: 'Wrap', de: 'Wrap' },
        price: 800,
        description: { hu: 'Csirkés wrap', en: 'Chicken Wrap', de: 'Hähnchen Wrap' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    },
    {
        name: { hu: 'Gyros', en: 'Gyros', de: 'Gyros' },
        price: 900,
        description: { hu: 'Görög gyros', en: 'Greek Gyros', de: 'Griechischer Gyros' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    },
    {
        name: { hu: 'Nuggets', en: 'Nuggets', de: 'Nuggets' },
        price: 700,
        description: { hu: 'Csirke nuggets', en: 'Chicken Nuggets', de: 'Hähnchen Nuggets' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    },
    {
        name: { hu: 'Hagymakarika', en: 'Onion Rings', de: 'Zwiebelringe' },
        price: 500,
        description: { hu: 'Ropogós hagymakarika', en: 'Crispy Onion Rings', de: 'Knusprige Zwiebelringe' },
        available: true,
        img: generateRandomBase64Image(),
        type: 'food'
    }
];

const defaultAdmin = {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 8)
};

const seedSpecialTypes = [
    {
        name: {
            hu: 'Laktózmentes',
            en: 'Lactose-Free',
            de: 'Laktosefrei'
        }
    },
    {
        name: {
            hu: 'Gluténmentes',
            en: 'Gluten-Free',
            de: 'Glutenfrei'
        }
    },
    {
        name: {
            hu: 'Vegetáriánus',
            en: 'Vegetarian',
            de: 'Vegetarisch'
        }
    },
    {
        name: {
            hu: 'Vegán',
            en: 'Vegan',
            de: 'Vegan'
        }
    },
    {
        name: {
            hu: 'Mogyorómentes',
            en: 'Nut-Free',
            de: 'Nussfrei'
        }
    },
    {
        name: {
            hu: 'Diabetikus',
            en: 'Diabetic',
            de: 'Diabetiker'
        }
    },
    {
        name: {
            hu: 'Tojásmentes',
            en: 'Egg-Free',
            de: 'Eifrei'
        }
    },
    {
        name: {
            hu: 'Csípős',
            en: 'Spicy',
            de: 'Scharf'
        }
    }
];
const seedBoxes = [
    {
        name: {
            hu: 'Kezdő Csomag',
            en: 'Starter Pack',
            de: 'Starter-Paket'
        },
        price: 5000,
        description: {
            hu: 'Alapvető merchandise termékek',
            en: 'Essential merchandise items',
            de: 'Grundlegende Merchandise-Artikel'
        },
        available: true,
        img: generateRandomBase64Image(),
        specialTypes: ['Limited Edition'],
        items: [] // Will be populated after items are created
    },
    {
        name: {
            hu: 'Gamer Csomag',
            en: 'Gamer Pack',
            de: 'Gamer-Paket'
        },
        price: 8000,
        description: {
            hu: 'Gamer kellékek',
            en: 'Gaming accessories',
            de: 'Gaming-Zubehör'
        },
        available: true,
        img: generateRandomBase64Image(),
        specialTypes: ['Premium'],
        items: [] // Will be populated after items are created
    }
];

// Update the seedDatabase function to include the new models
const seedDatabase = async () => {
    try {
        // Clear existing data
        await Item.deleteMany({});
        await Admin.deleteMany({});
        await Box.deleteMany({});
        await SpecialType.deleteMany({});

        // Insert new data
        const items = await Item.insertMany(seedItems);
        await Admin.create(defaultAdmin);
        const specialTypes = await SpecialType.insertMany(seedSpecialTypes);

        // Assign random items to boxes
        const modifiedBoxes = seedBoxes.map(box => {
            const randomItems = items
                .filter(item => item.type === 'food')
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(item => item._id);
            return {...box, items: randomItems};
        });

        await Box.insertMany(modifiedBoxes);

        console.log('Database seeded successfully with:');
        console.log('- 20 items');
        console.log('- 3 special types');
        console.log('- 2 boxes');
        console.log('- Default admin');
        console.log('Admin credentials - Username: admin, Password: admin123');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();