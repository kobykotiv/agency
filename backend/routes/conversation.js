const router = require('express').Router();
const { BackendService } = require('../services');

// Get all conversations for a crew
router.route('/:crewId').get(async (req, res) => {
  try {
    const crewId = req.params.crewId;
    const conversations = await BackendService.getConversations(crewId);
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Get a specific conversation by ID
router.route('/:conversationId').get(async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const conversation = await BackendService.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

// Add a message to a conversation
router.route('/:crewId').post(async (req, res) => {
  try {
    const crewId = req.params.crewId;
    const newMessage = req.body;
    const addedMessage = await BackendService.addMessage(crewId, newMessage);
    res.status(201).json(addedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

module.exports = router;