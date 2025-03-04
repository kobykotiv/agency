import express from 'express';
import { BackendService } from '../../backend/services';

const api = express.Router();

// API routes
api.get('/agents', async (req, res) => {
    const result = await BackendService.getAgents();
    res.json(result);
});

export default api;
