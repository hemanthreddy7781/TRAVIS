// In: main_backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for your React app
app.use(cors()); 
// Enable the server to accept and parse JSON in request bodies
app.use(express.json()); 


// --- Database Connection ---
// Make sure you have MONGO_URI in your .env file

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected...'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// I've commented out the DB connection so you can test the server without it for now.
//console.log("ℹ️  Database connection is currently commented out for testing.");


// --- API Routes ---
// Any request to /api/auth/... will be handled by the auth.js file
// app.use('/api/auth', require('./routes/auth')); // Assuming you have this file

// Any request to /api/conversations/... will be handled by the conversations.js file
app.use('/api/conversations', require('./routes/conversations'));


// --- Server Startup ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server is running on http://localhost:${PORT}`));