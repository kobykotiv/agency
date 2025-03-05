import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Users, 
  Layers, 
  Link2, 
  Activity, 
  Workflow,
  Search
} from 'lucide-react';

// Sample AI Agents with CrewAI-inspired roles
const AGENTS = [
  {
    id: 'research-lead',
    name: 'Dr. Aria Quantum',
    role: 'Research Coordinator',
    expertise: 'Complex Problem Analysis',
    color: 'bg-blue-500'
  },
  {
    id: 'strategy-architect',
    name: 'Marcus Nexus',
    role: 'Strategic Orchestrator',
    expertise: 'Workflow Optimization',
    color: 'bg-green-500'
  },
  {
    id: 'data-synthesizer',
    name: 'Nova Insight',
    role: 'Data Integration Specialist',
    expertise: 'Cross-domain Knowledge Mapping',
    color: 'bg-purple-500'
  }
];

// Sample conversation threads with nested structure
const INITIAL_THREADS = [
  {
    id: 'thread-1',
    title: 'Multiverse Research Initiative',
    rootMessage: {
      id: 'msg-1',
      agent: 'research-lead',
      content: 'Initiating comprehensive analysis of interdimensional research protocols.',
      timestamp: '2024-03-04T10:15:00Z',
      children: [
        {
          id: 'msg-2',
          agent: 'strategy-architect',
          content: 'Proposing a multi-stage approach to cross-dimensional data integration.',
          timestamp: '2024-03-04T10:20:00Z',
          children: [
            {
              id: 'msg-3',
              agent: 'data-synthesizer',
              content: 'Identified potential correlation matrices across observed timelines.',
              timestamp: '2024-03-04T10:25:00Z',
              children: []
            }
          ]
        }
      ]
    }
  },
  {
    id: 'thread-2',
    title: 'Quantum Workflow Optimization',
    rootMessage: {
      id: 'msg-4',
      agent: 'strategy-architect',
      content: 'Exploring advanced collaboration strategies for AI agent networks.',
      timestamp: '2024-03-04T11:00:00Z',
      children: []
    }
  }
];

const CrewAIChatInterface = () => {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [selectedThread, setSelectedThread] = useState(INITIAL_THREADS[0]);
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Recursive message rendering function
  const renderMessageThread = (message, depth = 0) => {
    const agent = AGENTS.find(a => a.id === message.agent);
    const isExpanded = expandedMessages.has(message.id);

    const toggleExpand = () => {
      const newExpandedMessages = new Set(expandedMessages);
      if (isExpanded) {
        newExpandedMessages.delete(message.id);
      } else {
        newExpandedMessages.add(message.id);
      }
      setExpandedMessages(newExpandedMessages);
    };

    return (
      <div 
        key={message.id} 
        className={`mb-4 pl-${depth * 4} relative`}
        style={{ 
          borderLeft: depth > 0 ? '2px solid #e0e0e0' : 'none'
        }}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center`}>
            <MessageCircle className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-sm">{agent.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
              {message.children && message.children.length > 0 && (
                <button 
                  onClick={toggleExpand}
                  className="text-xs text-gray-600 hover:text-blue-600"
                >
                  {isExpanded ? 'Collapse' : `Expand (${message.children.length})`}
                </button>
              )}
            </div>
            <p className="text-gray-700 mt-1">{message.content}</p>
          </div>
        </div>

        {isExpanded && message.children && message.children.map(childMessage => 
          renderMessageThread(childMessage, depth + 1)
        )}
      </div>
    );
  };

  // Flatten thread messages for search
  const flattenMessages = (thread) => {
    const flatten = (message) => {
      let messages = [message];
      if (message.children) {
        message.children.forEach(child => {
          messages = messages.concat(flatten(child));
        });
      }
      return messages;
    };
    return flatten(thread.rootMessage);
  };

  // Filter threads based on search query
  const filteredThreads = threads.filter(thread => 
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flattenMessages(thread).some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Threads Sidebar */}
      <div className="w-64 bg-gray-50 border-r p-4">
        <div className="mb-4 flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
          <Search className="text-gray-400 mr-2" size={20} />
          <input 
            type="text"
            placeholder="Search threads..."
            className="w-full focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Workflow className="mr-2" /> Threads
        </h2>

        {filteredThreads.map(thread => (
          <button
            key={thread.id}
            onClick={() => setSelectedThread(thread)}
            className={`w-full text-left p-3 rounded-lg mb-2 ${
              selectedThread.id === thread.id 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <Link2 className="mr-2 text-gray-500" size={16} />
              <span className="font-medium truncate">{thread.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Thread Header */}
        <div className="bg-gray-100 p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="mr-2" />
            <h1 className="text-xl font-semibold">
              {selectedThread.title}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="text-gray-500" />
            <span>{AGENTS.length} Agents Involved</span>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderMessageThread(selectedThread.rootMessage)}
        </div>
      </div>

      {/* Agent Details Sidebar */}
      <div className="w-64 bg-gray-50 border-l p-4">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Layers className="mr-2" /> Agents
        </h2>
        
        {AGENTS.map(agent => (
          <div 
            key={agent.id} 
            className="bg-white p-4 rounded-lg shadow-sm mb-4"
          >
            <div className={`w-16 h-16 rounded-full ${agent.color} mx-auto mb-4 flex items-center justify-center`}>
              <MessageCircle className="text-white" size={32} />
            </div>
            <h3 className="text-center font-semibold">{agent.name}</h3>
            <p className="text-center text-gray-600 mb-2">{agent.role}</p>
            <div className="bg-gray-100 p-2 rounded text-center">
              <span className="font-medium text-sm">Expertise:</span>
              <p className="text-xs text-gray-700">{agent.expertise}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrewAIChatInterface;
