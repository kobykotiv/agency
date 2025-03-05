import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Brain,
  Network,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Settings,
  GitBranch
} from 'lucide-react';

interface CrewFactoryProps {
  onCreateCrew?: (crew: any) => void;
  className?: string;
}

interface AIModel {
  name: string;
  type: 'small' | 'medium' | 'large';
  messages: Message[];
}

interface Message {
  id: string;
  modelName: string;
  content: string;
  timestamp: number;
  confidence: number;
  type: 'input' | 'reasoning' | 'output';
}

const CrewFactory: React.FC<CrewFactoryProps> = ({ onCreateCrew, className = '' }) => {
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

  const [activeModelName, setActiveModelName] = useState<string>('Initial Classifier');

  const getModelIcon = (type: AIModel['type']) => {
    switch (type) {
      case 'small':
        return <Brain className="h-5 w-5" />;
      case 'medium':
        return <Network className="h-5 w-5" />;
      case 'large':
        return <MessageCircle className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  return (
    <div className={`grid grid-cols-3 gap-4 p-4 ${className}`}>
      {models.map((model) => (
        <Card
          key={model.name}
          className={`
            ${model.type === 'small' ? 'border-blue-200' :
              model.type === 'medium' ? 'border-green-200' :
                'border-purple-200'}
            transition-all duration-300
          `}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              {getModelIcon(model.type)}
              <CardTitle className="text-lg">{model.name}</CardTitle>
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
                onClick={() => {/* Implementation for processing */}}
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                className="text-red-500 hover:bg-red-100 p-1 rounded"
                onClick={() => {/* Implementation for reset */}}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                className="text-green-500 hover:bg-green-100 p-1 rounded"
                onClick={() => {/* Implementation for branching */}}
              >
                <GitBranch className="h-4 w-4" />
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

export default CrewFactory;