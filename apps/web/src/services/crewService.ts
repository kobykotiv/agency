interface CrewConfig {
  agents: Array<{
    role: string;
    goal: string;
    backstory: string;
    llm: any;
    tools: string[];
  }>;
  tasks: Array<{
    description: string;
    agent: string;
  }>;
}

interface ImportResponse {
  crew: any;
  agents: any[];
  tasks: any[];
}

interface DeployResponse {
  success: boolean;
  output: string;
}

export class CrewService {
  private static baseUrl = '/api/crew';

  static async importYaml(yaml: string, variables: Record<string, string>): Promise<ImportResponse> {
    const response = await fetch(`${this.baseUrl}/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ yaml, variables }),
    });

    if (!response.ok) {
      throw new Error('Failed to import YAML configuration');
    }

    return response.json();
  }

  static async deployCrew(config: CrewConfig): Promise<DeployResponse> {
    const response = await fetch(`${this.baseUrl}/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error('Failed to deploy crew');
    }

    return response.json();
  }

  static async getAllCrews(): Promise<any[]> {
    const response = await fetch(this.baseUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch crews');
    }

    return response.json();
  }

  static async getCrew(crewId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${crewId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch crew');
    }

    return response.json();
  }

  static async updateCrew(crewId: string, crew: any): Promise<void> {
    const response = await fetch(`${this.baseUrl}/update/${crewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(crew),
    });

    if (!response.ok) {
      throw new Error('Failed to update crew');
    }
  }

  static async deleteCrew(crewId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete/${crewId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete crew');
    }
  }
}