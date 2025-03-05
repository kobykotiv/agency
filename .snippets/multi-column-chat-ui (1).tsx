import React, { useState, useRef } from 'react';
import { 
  ChevronRight, Brain, Server, Network, GitBranch, Send, 
  Menu, Settings, Maximize, Minimize, ZoomIn, ZoomOut, 
  Wand, Tool, X, PlusCircle, Code, Database 
} from 'lucide-react';

// Mock data structures
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

const initialLLMProfiles = [
  {
    id: 'wizardlm',
    name: 'WizardLM Prompt Optimizer',
    description: 'Advanced prompt engineering model',
    specialties: ['Prompt Optimization', 'Context Expansion']
  },
  {
    id: 'mistral',
    name: 'Mistral Instruct',
    description: 'Instruction-tuned language model',
    specialties: ['Reasoning', 'Task Completion']
  }
];

const ReasoningColumn = ({ chain, activeLevel }) => (
  <div className="w-1/3 bg-gray-100 p-4 border-r">
    <h2 className="font-bold mb-4 flex items-center">
      <Brain className="mr-2" /> AI Reasoning Chain
    </h2>
    {chain.map((model) => (
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

const ToolCallsColumn = ({ toolCalls }) => (
  <div className="w-1/3 bg-gray-50 p-4 border-r">
    <h2 className="font-bold mb-4 flex items-center">
      <Tool className="mr-2" /> Tool Calls
    </h2>
    {toolCalls.map((tool, index) => (
      <div key={index} className="bg-white p-3 rounded border mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold flex items-center">
            <Code className="mr-2 text-blue-500" /> {tool.name}
          </span>
          <span className={`
            px-2 py-1 rounded text-xs
            ${tool.status === 'completed' ? 'bg-green-200' : 'bg-yellow-200'}
          `}>
            {tool.status}
          </span>
        </div>
        <p className="text-sm text-gray-600">{tool.description}</p>
        <div className="mt-2 text-xs">
          <strong>Input:</strong> {tool.input}
        </div>
      </div>
    ))}
  </div>
);

const LLMConfigPanel = ({ profiles, onAddProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? <X /> : <PlusCircle />}
      </button>
      {isOpen && (
        <div className="bg-white border rounded shadow-lg p-4 mt-2 w-64">
          <h3 className="font-bold mb-2 flex items-center">
            <Settings className="mr-2" /> LLM Profiles
          </h3>
          {profiles.map((profile) => (
            <div 
              key={profile.id} 
              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <div className="font-semibold">{profile.name}</div>
              <p className="text-xs text-gray-600">{profile.description}</p>
            </div>
          ))}
          <button 
            onClick={onAddProfile}
            className="mt-2 w-full bg-green-500 text-white p-2 rounded flex items-center justify-center"
          >
            <Wand className="mr-2" /> Generate New Profile
          </button>
        </div>
      )}
    </div>
  );
};

const AccessibilityPanel = () => {
  const [fontSize, setFontSize] = useState(16);
  const [isHigh, setIsHigh] = useState(false);

  return (
    <div className="fixed top-4 right-4 bg-white border rounded p-3 shadow-lg">
      <h3 className="font-bold mb-2 flex items-center">
        <Maximize className="mr-2" /> Accessibility
      </h3>
      <div className="flex items-center mb-2">
        <ZoomOut className="mr-2" />
        <input 
          type="range" 
          min="12" 
          max="24" 
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="flex-grow"
        />
        <ZoomIn className="ml-2" />
      </div>
      <div className="flex items-center">
        <input 
          type="checkbox"
          checked={isHigh}
          onChange={() => setIsHigh(!isHigh)}
          className="mr-2"
        />
        <label>High Contrast Mode</label>
      </div>
    </div>
  );
};

const SanityStyleChatUI = () => {
  const [toolCalls, setToolCalls] = useState([
    {
      name: 'Search',
      status: 'completed',
      description: 'Web search for quantum computing',
      input: 'latest quantum computing breakthroughs'
    }
  ]);

  const [llmProfiles, setLLMProfiles] = useState(initialLLMProfiles);

  const handleAddProfile = () => {
    // Placeholder for profile generation logic
    const newProfile = {
      id: `profile_${Date.now()}`,
      name: 'Custom LLM Profile',
      description: 'Dynamically generated profile',
      specialties: ['Custom Optimization']
    };
    setLLMProfiles([...llmProfiles, newProfile]);
  };

  return (
    <div className="flex h-screen">
      <ReasoningColumn 
        chain={initialReasoningChain} 
        activeLevel={'Small Model'} 
      />
      <ToolCallsColumn toolCalls={toolCalls} />
      <div className="w-1/3 bg-white flex flex-col">
        {/* Existing MessageColumn content */}
      </div>
      <LLMConfigPanel 
        profiles={llmProfiles}
        onAddProfile={handleAddProfile}
      />
      <AccessibilityPanel />
    </div>
  );
};

export default SanityStyleChatUI;
