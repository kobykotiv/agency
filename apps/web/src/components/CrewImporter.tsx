import React, { useState } from 'react';
import { CrewService } from '../services/crewService';

interface Status {
  type: 'success' | 'error';
  message: string;
}

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
export const CrewImporter: React.FC = () => {
  const [config, setConfig] = useState<CrewConfig | null>(null);
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<Status | null>(null);


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const result = await CrewService.importYaml(text, {
          topic,
          current_year: new Date().getFullYear().toString(),
        });
        setConfig(result);
        setStatus({
          type: 'success',
          message: 'Crew configuration imported successfully'
        });
      } catch (error) {
        console.error('Error importing crew:', error);
        setStatus({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to import crew configuration'
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDeploy = async () => {
    if (!config) return;

    try {
      const result = await CrewService.deployCrew(config);
      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Crew deployed successfully'
        });
      }
    } catch (error) {
      console.error('Error deploying crew:', error);
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to deploy crew'
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Crew AI Importer</h1>
      
      {status && (
        <div
          className={`mb-4 p-4 rounded ${
            status.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Topic:
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Enter topic"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Upload YAML Configuration:
          <input
            type="file"
            accept=".yaml,.yml"
            onChange={handleFileUpload}
            className="mt-1 block w-full"
          />
        </label>
      </div>

      {config && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Configuration Preview:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(config, null, 2)}
          </pre>
          
          <button
            onClick={handleDeploy}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Deploy Crew
          </button>
        </div>
      )}
    </div>
  );
};