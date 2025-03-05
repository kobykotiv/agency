import { Router } from 'express';
import { CrewAiService } from '@crew-ai/backend/services/crewAiService';
import { 
  CrewAIServiceConfig, 
  CrewAIAgent, 
  CrewAITask, 
  CrewAIResponse 
} from '@crew-ai/types';
import { z } from 'zod';

// Add type for error handling
interface ApiError extends Error {
  errors?: z.ZodError[];
}

const router: Router = Router();

// Validation schemas
const configSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  agents: z.array(z.object({
    name: z.string(),
    role: z.string(),
    goals: z.array(z.string()),
    backstory: z.string().optional(),
    allowedTools: z.array(z.string()).optional(),
  })),
  tasks: z.array(z.object({
    description: z.string(),
    agent: z.string(),
    expectedOutput: z.string().optional(),
    contextFiles: z.array(z.string()).optional(),
  })),
  verbose: z.boolean().optional(),
  baseUrl: z.string().optional(),
  defaultTimeout: z.number().optional(),
  apiKey: z.string().optional(),
});

// Create a new crew
router.post('/', async (req: Request, res: Response) => {
  try {
    const config = configSchema.parse(req.body) as CrewAIServiceConfig;
    const service = new CrewAiService(config);
    const crewId = await service.createCrew();
    res.status(201).json({ crewId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create crew' });
    }
  }
});

// Add an agent to crew
router.post('/:crewId/agents', async (req: Request, res: Response) => {
  try {
    const { crewId } = req.params;
    const agent = req.body as CrewAIAgent;
    const config = { name: crewId } as CrewAIServiceConfig; // Minimal config for agent operations
    const service = new CrewAiService(config);
    await service.addAgent(agent);
    res.status(201).json({ message: 'Agent added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add agent' });
  }
});

// Add a task to crew
router.post('/:crewId/tasks', async (req, res) => {
  try {
    const { crewId } = req.params;
    const task = req.body as CrewAITask;
    const config = { name: crewId } as CrewAIServiceConfig;
    const service = new CrewAiService(config);
    const taskId = await service.addTask(task);
    res.status(201).json({ taskId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Execute a specific task
router.post('/:crewId/tasks/:taskId/execute', async (req, res) => {
  try {
    const { crewId, taskId } = req.params;
    const config = { name: crewId } as CrewAIServiceConfig;
    const service = new CrewAiService(config);
    const result = await service.executeTask(taskId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute task' });
  }
});

// Get task status
router.get('/:crewId/tasks/:taskId', async (req, res) => {
  try {
    const { crewId, taskId } = req.params;
    const config = { name: crewId } as CrewAIServiceConfig;
    const service = new CrewAiService(config);
    const status = await service.getTaskStatus(taskId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get task status' });
  }
});

// Execute all tasks in crew
router.post('/:crewId/execute', async (req, res) => {
  try {
    const { crewId } = req.params;
    const config = configSchema.parse(req.body) as CrewAIServiceConfig;
    const service = new CrewAiService(config);
    const results = await service.executeTasks();
    res.json(results);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to execute tasks' });
    }
  }
});

export default router;