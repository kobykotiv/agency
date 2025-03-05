import React, { useState } from 'react';
import { ChevronRight, Brain, Server, Network } from 'lucide-react';

// Mock data structure for AI reasoning chain
const initialReasoningChain = [
  {
    level: 'Small Model',
    modelName: 'Ollama Mistral',
    status: 'Processing',
    reasoning: [
      'Analyzing initial query',
      'Identifying key decision points',
      'Preparing context for escalation'
    ],
    confidence: 0.6
  },
  {
    level: 'Medium Model',
    modelName: 'Ollama Llama2',
    status: 'Waiting',
    reasoning: [],
    confidence: 0
  },
  {
    level: 'Large Model',
    modelName: 'Ollama GPT-Like',
    status: 'Idle',
    reasoning: [],
    confidence: 0
  }
];

const ReasoningColumn = ({ chain, activeLevel }) => (
  <div className="w-1/3 bg-gray-100 p-4 border-r">
    <h2 className="font-bold mb-4 flex items-center">
      <Brain className="mr-2" /> AI Reasoning Chain
    </h2>
    {chain.map((model, index) => (
      <div 
        key={model.level} 
        className={`mb-4 p-3 rounded transition-all ${
          activeLevel === model.level 
            ? 'bg-blue-100 border-blue-500 border' 
            : 'bg-white border'
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{model.level}</h3>
          <span className={`
            px-2 py-1 rounded text-xs
            ${model.status === 'Processing' ? 'bg-yellow-200' : 
              model.status === 'Waiting' ? 'bg-gray-200' : 
              'bg-green-200'}
          `}>
            {model.status}
          </span>
        </div>
        <p className="text-sm mt-2">{model.modelName}</p>
        <div className="mt-2">
          {model.reasoning.map((reason, idx) => (
            <div key={idx} className="text-xs text-gray-600 mb-1">
              • {reason}
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm">
          Confidence: {(model.confidence * 100).toFixed(0)}%
        </div>
      </div>
    ))}
  </div>
);

const OllamaConnectionPanel = () => (
  <div className="w-1/3 bg-gray-50 p-4 border-r">
    <h2 className="font-bold mb-4 flex items-center">
      <Server className="mr-2" /> Ollama Instance
    </h2>
    <div className="bg-white p-3 rounded border">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Connection Status</span>
        <span className="px-2 py-1 bg-green-200 rounded text-xs">
          Connected
        </span>
      </div>
      <div className="text-sm text-gray-600">
        <p>Endpoint: localhost:11434</p>
        <p>Active Models: 3</p>
        <p>GPU Utilization: 45%</p>
      </div>
    </div>
    <div className="mt-4 bg-white p-3 rounded border">
      <h3 className="font-semibold mb-2 flex items-center">
        <Network className="mr-2 text-blue-500" /> 
        Model Registry
      </h3>
      <ul className="text-sm">
        <li>✓ mistral:7b</li>
        <li>✓ llama2:13b</li>
        <li>✓ neural-chat:7b</li>
      </ul>
    </div>
  </div>
);

const MessageColumn = ({ messages }) => (
  <div className="w-1/3 bg-white p-4">
    <h2 className="font-bold mb-4">Conversation</h2>
    {messages.map((msg, index) => (
      <div 
        key={index} 
        className={`mb-4 p-3 rounded ${
          msg.sender === 'human' 
            ? 'bg-blue-50 text-right' 
            : 'bg-green-50'
        }`}
      >
        <div className="font-semibold text-sm mb-2">
          {msg.sender === 'human' ? 'You' : 'AI'}
        </div>
        <p>{msg.text}</p>
      </div>
    ))}
  </div>
);

const SanityStyleChatUI = () => {
  const [reasoningChain, setReasoningChain] = useState(initialReasoningChain);
  const [activeLevel, setActiveLevel] = useState('Small Model');
  const [messages, setMessages] = useState([
    { sender: 'human', text: 'Explain quantum computing' }
  ]);

  return (
    <div className="flex h-screen">
      <ReasoningColumn 
        chain={reasoningChain} 
        activeLevel={activeLevel} 
      />
      <OllamaConnectionPanel />
      <MessageColumn messages={messages} />
    </div>
  );
};

export default SanityStyleChatUI;
