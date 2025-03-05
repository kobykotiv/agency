export {
  Agent as CrewAIAgent,
  Task as CrewAITask,
  CrewConfig as CrewAIServiceConfig,
  CrewResponse as CrewAIResponse,
} from './crewai';

// CrewAI Task Status enum
export enum CrewAITaskStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
  IN_PROGRESS = 'in_progress',
}

// Re-export schemas for validation
export {
  AgentSchema,
  TaskSchema,
  CrewConfigSchema,
  CrewResponseSchema,
} from './crewai';