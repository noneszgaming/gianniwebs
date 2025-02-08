require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/items');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:5173'
  }));

// Middleware
app.use(express.json()); // A HTTP kérések törzsének (body) feldolgozásához

// Útvonalak regisztrálása
app.use('/api', itemRoutes);
app.use('/api',adminRoutes);

// MongoDB kapcsolat
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {console.log('Connected to MongoDB');})
    .catch(err => {console.error('Failed to connect to MongoDB', err);
});

// Szerver indítása
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});