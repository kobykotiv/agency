import { z } from 'zod';

// CrewAI Agent Schema
export const AgentSchema = z.object({
  name: z.string(),
  role: z.string(),
  goals: z.array(z.string()),
  backstory: z.string().optional(),
  allowedTools: z.array(z.string()).optional(),
});

export type Agent = z.infer<typeof AgentSchema>;

// CrewAI Task Schema
export const TaskSchema = z.object({
  description: z.string(),
  agent: z.string(), // Agent name
  expectedOutput: z.string().optional(),
  contextFiles: z.array(z.string()).optional(),
  status: z.enum(['completed', 'failed', 'in_progress']).optional(),
  error: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

// CrewAI Service Configuration Schema
export const CrewConfigSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  agents: z.array(AgentSchema),
  tasks: z.array(TaskSchema),
  verbose: z.boolean().optional().default(false),
  baseUrl: z.string().optional().default('http://localhost:8000'),
  defaultTimeout: z.number().optional().default(300000),
  maxRetries: z.number().optional().default(3),
  apiKey: z.string().optional(),
});

export type CrewConfig = z.infer<typeof CrewConfigSchema>;

// CrewAI Response Schema
export const CrewResponseSchema = z.object({
  taskId: z.string(),
  agentName: z.string(),
  result: z.string(),
  status: z.enum(['completed', 'failed', 'in_progress']),
  timestamp: z.string(),
  error: z.string().optional(),
});

export type CrewResponse = z.infer<typeof CrewResponseSchema>;