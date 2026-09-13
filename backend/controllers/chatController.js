// In: main_backend/controllers/chatController.js

const Conversation = require('../models/Conversation');

// @desc Save a new conversation
// @route POST /api/conversations/save
// @access Private (requires auth middleware to set req.user)
const saveConversation = async (req, res) => {
  try {
    // req.user.id is set by the auth middleware after verifying the JWT
    const userId = req.user.id;
    const { messages } = req.body;

    if (!userId || !messages) {
      return res.status(400).json({ message: "User ID and messages are required." });
    }

    const newConversation = new Conversation({
      user: userId,
      messages, // e.g. [{ sender: 'user', text: 'hello' }, { sender: 'bot', text: 'Hi!' }]
    });

    await newConversation.save();

    res.status(201).json({
      message: "Conversation saved successfully!",
      conversation: newConversation,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error while saving conversation." });
  }
};

// @desc Get conversation history for the logged-in user
// @route GET /api/conversations/history
// @access Private (requires auth middleware to set req.user)
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "History fetched successfully",
      conversations,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error while fetching history." });
  }
};

module.exports = {
  saveConversation,
  getConversations,
};