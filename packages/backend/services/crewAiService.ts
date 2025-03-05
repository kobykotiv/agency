import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  CrewAIAgent,
  CrewAITask,
  CrewAIResponse,
  CrewAIServiceConfig,
  CrewAITaskStatus,
} from '@crew-ai/types';

export class CrewAiService {
  private axiosInstance: AxiosInstance;
  private config: CrewAIServiceConfig;

  constructor(config: CrewAIServiceConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || 'http://localhost:8000',
      defaultTimeout: config.defaultTimeout || 300000,
      maxRetries: config.maxRetries || 3,
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.defaultTimeout,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey }),
      },
    });
  }

  public async createCrew(): Promise<string> {
    try {
      const response = await this.axiosInstance.post('/crew', {
        name: this.config.name,
        description: this.config.description,
        verbose: this.config.verbose,
      });
      return response.data.crewId;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async addAgent(agent: CrewAIAgent): Promise<void> {
    try {
      await this.axiosInstance.post('/agents', agent);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async addTask(task: CrewAITask): Promise<string> {
    try {
      const response = await this.axiosInstance.post('/tasks', task);
      return response.data.taskId;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async executeTask(taskId: string): Promise<CrewAIResponse> {
    try {
      const response = await this.axiosInstance.post(`/tasks/${taskId}/execute`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async getTaskStatus(taskId: string): Promise<CrewAIResponse> {
    try {
      const response = await this.axiosInstance.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async executeTasks(): Promise<CrewAIResponse[]> {
    const results: CrewAIResponse[] = [];
    let retries = 0;

    for (const task of this.config.tasks) {
      try {
        const taskId = await this.addTask(task);
        const result = await this.executeTask(taskId);
        results.push(result);

        if (result.status === CrewAITaskStatus.FAILED && retries < this.config.maxRetries) {
          retries++;
          // Retry failed task
          continue;
        }

        // Reset retries for next task
        retries = 0;
      } catch (error) {
        const typedTask = task as CrewAITask & { status?: string; error?: string };
        typedTask.status = CrewAITaskStatus.FAILED;
        typedTask.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }
    }

    return results;
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return new Error(
        axiosError.response?.data?.message || axiosError.message || 'Unknown API error'
      );
    }
    return error instanceof Error ? error : new Error('Unknown error');
  }
}

export default CrewAiService;