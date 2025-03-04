import mongoose from 'mongoose';

const crewSchema = new mongoose.Schema({
  name: String,
  description: String,
  agents: [String],
  tasks: [String],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const agentSchema = new mongoose.Schema({
  name: String,
  role: String,
  goal: String,
  backstory: String,
  tools: [String],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  description: String,
  agent_id: String,
  crew_id: String,
  status: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  crew_id: String,
  messages: [{
    sender: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Crew = mongoose.model('Crew', crewSchema);
const Agent = mongoose.model('Agent', agentSchema);
const Task = mongoose.model('Task', taskSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

export class BackendService {
  static async getAgents() {
    return Agent.find();
  }

  static async getAgent(agentId: string) {
    return Agent.findById(agentId);
  }

  static async addAgent(agent: any) {
    const newAgent = new Agent(agent);
    return newAgent.save();
  }

  static async updateAgent(agentId: string, agent: any) {
    return Agent.findByIdAndUpdate(agentId, agent, { new: true });
  }

  static async deleteAgent(agentId: string) {
    return Agent.findByIdAndDelete(agentId);
  }

  static async getCrews() {
    return Crew.find();
  }

  static async getCrew(crewId: string) {
    return Crew.findById(crewId);
  }

  static async addCrew(crew: any) {
    const newCrew = new Crew(crew);
    return newCrew.save();
  }

  static async updateCrew(crewId: string, crew: any) {
    return Crew.findByIdAndUpdate(crewId, crew, { new: true });
  }

  static async deleteCrew(crewId: string) {
    return Crew.findByIdAndDelete(crewId);
  }

  static async getTasks() {
    return Task.find();
  }

  static async getTask(taskId: string) {
    return Task.findById(taskId);
  }

  static async addTask(task: any) {
    const newTask = new Task(task);
    return newTask.save();
  }

  static async updateTask(taskId: string, task: any) {
    return Task.findByIdAndUpdate(taskId, task, { new: true });
  }

  static async deleteTask(taskId: string) {
    return Task.findByIdAndDelete(taskId);
  }

  static async getConversations(crewId: string) {
    return Conversation.find({ crew_id: crewId });
  }

  static async getConversation(conversationId: string) {
    return Conversation.findById(conversationId);
  }

  static async addMessage(crewId: string, message: any) {
    const conversation = await Conversation.findOne({ crew_id: crewId });
    if (conversation) {
      conversation.messages.push(message);
      conversation.updated_at = new Date();
      return conversation.save();
    } else {
      const newConversation = new Conversation({
        crew_id: crewId,
        messages: [message]
      });
      return newConversation.save();
    }
  }

  static async importCrewFromYaml(yamlContent: string, variables: any) {
    try {
      const yaml = require('js-yaml');
      
      // Replace template variables
      let processedYaml = yamlContent;
      Object.entries(variables || {}).forEach(([key, value]) => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        processedYaml = processedYaml.replace(regex, value as string);
      });

      // Parse YAML content
      const crewConfig = yaml.load(processedYaml);

      // Create agents
      const agentPromises = crewConfig.agents.map(async (agentConfig: any) => {
        const agent = new Agent({
          role: agentConfig.role,
          goal: agentConfig.goal,
          backstory: agentConfig.backstory,
          tools: agentConfig.tools || []
        });
        return agent.save();
      });
      const agents = await Promise.all(agentPromises);

      // Create crew
      const crew = new Crew({
        name: variables?.topic || 'New Crew',
        description: `Crew created from YAML import for ${variables?.topic || 'unknown topic'}`,
        agents: agents.map(agent => agent._id)
      });
      await crew.save();

      // Create tasks
      const taskPromises = crewConfig.tasks.map(async (taskConfig: any) => {
        const agent = agents.find(a => a.role === taskConfig.agent);
        if (!agent) {
          throw new Error(`Agent not found for task: ${taskConfig.description}`);
        }

        const task = new Task({
          description: taskConfig.description,
          agent_id: agent._id,
          crew_id: crew._id,
          status: 'pending'
        });
        return task.save();
      });
      const tasks = await Promise.all(taskPromises);
      
      // Update crew with task IDs
      crew.tasks = tasks.map(task => task._id);
      await crew.save();

      return {
        crew,
        agents,
        tasks
      };
    } catch (error) {
      console.error('Error importing crew from YAML:', error);
      throw error;
    }
  }

  static async deployCrew(crewConfig: any) {
    try {
      const { spawn } = require('child_process');
      const path = require('path');
      const fs = require('fs').promises;

      // Create a temporary directory for crew deployment
      const tempDir = path.join(__dirname, '..', 'temp', `crew-${Date.now()}`);
      await fs.mkdir(tempDir, { recursive: true });

      // Write crew configuration to temporary files
      const agentsYaml = require('js-yaml').dump({ agents: crewConfig.agents });
      const tasksYaml = require('js-yaml').dump({ tasks: crewConfig.tasks });
      
      await fs.writeFile(path.join(tempDir, 'agents.yaml'), agentsYaml);
      await fs.writeFile(path.join(tempDir, 'tasks.yaml'), tasksYaml);

      // Create and execute the crew
      const process = spawn('python3', ['-m', 'crewai', 'run', '--config', tempDir], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      return new Promise((resolve, reject) => {
        let output = '';
        
        process.stdout.on('data', (data) => {
          output += data.toString();
        });

        process.stderr.on('data', (data) => {
          console.error(`Error: ${data}`);
        });

        process.on('close', async (code) => {
          // Clean up temporary directory
          await fs.rm(tempDir, { recursive: true, force: true });

          if (code === 0) {
            resolve({ success: true, output });
          } else {
            reject(new Error(`Crew deployment failed with code ${code}`));
          }
        });
      });
    } catch (error) {
      console.error('Error deploying crew:', error);
      throw error;
    }
  }
}
