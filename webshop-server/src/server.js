require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/items');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');
const storeRoutes = require('./routes/store');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({
    limit: '100mb',
    extended: true,
    parameterLimit: 50000
}));

app.use(express.urlencoded({
    limit: '100mb',
    extended: true,
    parameterLimit: 50000
}));

app.use(cors({
    origin: 'http://localhost:5173'
  }));

// Middleware
app.use(express.json()); // A HTTP kérések törzsének (body) feldolgozásához

// Útvonalak regisztrálása
app.use('/api', itemRoutes);
app.use('/api', adminRoutes);
app.use('/api', orderRoutes);
app.use('/api', storeRoutes);
// MongoDB kapcsolat
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {console.log('Connected to MongoDB');})
    .catch(err => {console.error('Failed to connect to MongoDB', err);
});

// Szerver indítása
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});