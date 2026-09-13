// In: main_backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// --- Database Connection ---
connectDB();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for your React app
app.use(cors());
// Enable the server to accept and parse JSON in request bodies
app.use(express.json());


// --- API Routes ---
// Any request to /api/auth/... will be handled by the auth.js file
 app.use('/api/auth', require('./routes/auth')); // Assuming you have this file

// Any request to /api/conversations/... will be handled by the conversations.js file
app.use('/api/conversations', require('./routes/conversations'));


// --- Server Startup ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server is running on http://localhost:${PORT}`));