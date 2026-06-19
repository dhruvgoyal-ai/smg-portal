const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
// This allows our server to understand JSON data sent from the frontend
app.use(express.json());
// This allows the frontend to talk to the backend even if they are on different ports
app.use(cors());

// Basic Route
app.get('/', (req, res) => {
    res.send('Logistics Portal Backend is Running!');
});

// Routes
app.use('/api/customers', require('./routes/customerRoutes'));


// Port Configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the server
// Note: We will add the MongoDB URI to a .env file soon
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/logistics_portal';

mongoose.connect(mongoURI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
    });
