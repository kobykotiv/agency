const router = require('express').Router();
const { BackendService } = require('../services');

// Get all agents
router.route('/').get(async (req, res) => {
  try {
    const agents = await BackendService.getAgents();
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get agents' });
  }
});

// Get an agent by ID
router.route('/:agentId').get(async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const agent = await BackendService.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get agent' });
  }
});

// Add a new agent
router.route('/add').post(async (req, res) => {
  try {
    const newAgent = req.body;
    const addedAgent = await BackendService.addAgent(newAgent);
    res.status(201).json(addedAgent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add agent' });
  }
});

// Update an agent
router.route('/update/:agentId').put(async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const updatedAgent = req.body;
    const result = await BackendService.updateAgent(agentId, updatedAgent);
    if (!result) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json({ message: 'Agent updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// Delete an agent
router.route('/delete/:agentId').delete(async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const result = await BackendService.deleteAgent(agentId);
    if (!result) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

module.exports = router;