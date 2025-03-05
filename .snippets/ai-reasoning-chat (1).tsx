import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  Network, 
  MessageSquare 
} from 'lucide-react';

/**
 * Represents a single message in the AI reasoning process
 * @interface
 */
interface ReasoningMessage {
  id: string;
  modelName: string;
  content: string;
  timestamp: number;
  confidence: number;
  type: 'input' | 'reasoning' | 'output';
}

/**
 * Represents a hierarchical AI reasoning model
 * @interface
 */
interface AIModel {
  name: string;
  type: 'small' | 'large';
  messages: ReasoningMessage[];
}

/**
 * Primary AI Reasoning Chat Interface Component
 * @component
 * @returns {React.ReactElement} Rendering of multi-column AI reasoning interface
 */
const AIReasoningChat: React.FC = () => {
  // State management for AI models and their reasoning chain
  const [models, setModels] = useState<AIModel[]>([
    {
      name: 'Initial Classifier',
      type: 'small',
      messages: []
    },
    {
      name: 'Context Enricher',
      type: 'medium',
      messages: []
    },
    {
      name: 'Final Decision Maker',
      type: 'large',
      messages: []
    }
  ]);

  // WebSocket connection state for Ollama instances
  const [ollamaConnection, setOllamaConnection] = useState<WebSocket | null>(null);

  /**
   * Establishes WebSocket connection to Ollama instance
   * @method
   */
  const connectToOllama = () => {
    try {
      const ws = new WebSocket('ws://localhost:11434/ollama-stream');
      
      ws.onopen = () => {
        console.log('Connected to Ollama instance');
        setOllamaConnection(ws);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Process incoming Ollama messages and update model reasoning
        updateModelReasoning(data);
      };

      ws.onerror = (error) => {
        console.error('Ollama WebSocket Error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to Ollama:', error);
    }
  };

  /**
   * Updates model reasoning based on incoming messages
   * @param {Object} messageData - Incoming message data from Ollama
   */
  const updateModelReasoning = (messageData: any) => {
    setModels(prevModels => 
      prevModels.map(model => {
        // Logic to update model messages based on incoming data
        return model;
      })
    );
  };

  // Connect to Ollama on component mount
  useEffect(() => {
    connectToOllama();
    
    return () => {
      ollamaConnection?.close();
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 min-h-screen">
      {models.map((model, index) => (
        <Card 
          key={model.name} 
          className={`
            ${model.type === 'small' ? 'border-blue-200' : 
              model.type === 'medium' ? 'border-green-200' : 
              'border-purple-200'}
            shadow-md transition-all duration-300
          `}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              {model.type === 'small' ? <Brain size={16} /> : 
               model.type === 'medium' ? <Network size={16} /> : 
               <MessageSquare size={16} />}
              <CardTitle>{model.name}</CardTitle>
            </div>
            <div className="text-xs text-gray-500">
              {model.type.charAt(0).toUpperCase() + model.type.slice(1)} Model
            </div>
          </CardHeader>
          
          <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
            {model.messages.map(msg => (
              <div 
                key={msg.id} 
                className={`
                  p-2 rounded-md 
                  ${msg.type === 'input' ? 'bg-blue-50' : 
                    msg.type === 'reasoning' ? 'bg-green-50' : 
                    'bg-purple-50'}
                `}
              >
                <div className="text-xs font-semibold text-gray-600">
                  {msg.modelName} - {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div>{msg.content}</div>
                <div className="text-right text-xs text-gray-500">
                  Confidence: {(msg.confidence * 100).toFixed(2)}%
                </div>
              </div>
            ))}
          </CardContent>
          
          <CardFooter className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                onClick={() => {/* Trigger model reasoning */}}
              >
                <ChevronUp size={16} />
              </button>
              <button 
                className="text-red-500 hover:bg-red-100 p-1 rounded"
                onClick={() => {/* Reset model state */}}
              >
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="text-xs text-gray-400">
              {model.messages.length} messages
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AIReasoningChat;
