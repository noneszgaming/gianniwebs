require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http'); // Add this
const itemRoutes = require('./routes/items');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');
const emailRoutes = require('./routes/email');
const boxesRoutes = require('./routes/boxes');
const userRoutes = require('./routes/users');
const storeRoutes = require('./routes/store');
const specialTypesRoutes = require('./routes/specialTypes');

const app = express();
const server = http.createServer(app); // Create HTTP server
const wsService = require('./services/websocket')(server); // Initialize WebSocket after server creation

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
    origin: ['http://91.214.112.140', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Routes registration
app.use('/api', itemRoutes);
app.use('/api', adminRoutes);
app.use('/api', orderRoutes);
app.use('/api', storeRoutes(wsService));
app.use('/api', emailRoutes);
app.use('/api', boxesRoutes);
app.use('/api', userRoutes);
app.use('/api', specialTypesRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {console.log('Connected to MongoDB');})
    .catch(err => {console.error('Failed to connect to MongoDB', err);});

// Start server
server.listen(PORT, () => { // Use server.listen instead of app.listen
    console.log(`Server is running on port ${PORT}`);
});
