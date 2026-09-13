// In: main_backend/routes/conversations.js

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {
  saveConversation,
  getConversations
} = require('../controllers/chatController');

// Both routes now require a valid JWT — auth runs first, sets req.user, then the handler runs
router.post('/save', auth, saveConversation);
router.get('/history', auth, getConversations);

module.exports = router;