import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronRight, Share2, GitBranch, Plus, MessageCircle } from 'lucide-react';

// Utility function to safely access localStorage
const safeLocalStorage = {
  getItem: (key, defaultValue = null) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return defaultValue;
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }
};

// Message Node Type
interface MessageNode {
  id: number;
  content: string;
  timestamp: number;
  parentId?: number;
  branchId?: number;
  tags?: string[];
  author: string;
}

// Conversation Tree Type
interface ConversationTree {
  id: number;
  name: string;
  rootNodeId: number;
  nodes: { [key: number]: MessageNode };
}

const ConversationExplorer: React.FC = () => {
  // State for managing conversations
  const [conversations, setConversations] = useState<{ [key: number]: ConversationTree }>(() => 
    safeLocalStorage.getItem('conversationTrees', {})
  );
  
  // State for current active conversation and selected node
  const [activeConversationId, setActiveConversationId] = useState<number | null>(() => 
    safeLocalStorage.getItem('activeConversationId', null)
  );
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  // State for new message input
  const [newMessage, setNewMessage] = useState('');

  // Persist conversations to localStorage whenever they change
  useEffect(() => {
    safeLocalStorage.setItem('conversationTrees', conversations);
  }, [conversations]);

  // Persist active conversation ID
  useEffect(() => {
    safeLocalStorage.setItem('activeConversationId', activeConversationId);
  }, [activeConversationId]);

  // Create a new conversation tree
  const createConversation = useCallback(() => {
    const newId = Date.now();
    const rootNode: MessageNode = {
      id: newId,
      content: 'Conversation Start',
      timestamp: newId,
      author: 'System',
      tags: ['root']
    };

    const newConversation: ConversationTree = {
      id: newId,
      name: `Conversation ${Object.keys(conversations).length + 1}`,
      rootNodeId: newId,
      nodes: { [newId]: rootNode }
    };

    setConversations(prev => ({
      ...prev,
      [newId]: newConversation
    }));
    setActiveConversationId(newId);
  }, [conversations]);

  // Add a new message to the current conversation
  const addMessage = useCallback(() => {
    if (!activeConversationId || !newMessage.trim()) return;

    const conversation = conversations[activeConversationId];
    if (!conversation) return;

    const newNodeId = Date.now();
    const newNode: MessageNode = {
      id: newNodeId,
      content: newMessage,
      timestamp: newNodeId,
      parentId: selectedNodeId || conversation.rootNodeId,
      author: 'User',
      branchId: selectedNodeId ? Date.now() : undefined
    };

    // Update the conversation tree
    const updatedConversation = {
      ...conversation,
      nodes: {
        ...conversation.nodes,
        [newNodeId]: newNode
      }
    };

    setConversations(prev => ({
      ...prev,
      [activeConversationId]: updatedConversation
    }));

    // Reset input and potentially update selected node
    setNewMessage('');
    setSelectedNodeId(newNodeId);
  }, [activeConversationId, conversations, newMessage, selectedNodeId]);

  // Render nodes for the current conversation
  const renderConversationNodes = () => {
    if (!activeConversationId) return null;

    const conversation = conversations[activeConversationId];
    if (!conversation) return null;

    const nodes = Object.values(conversation.nodes);
    
    return (
      <div className="flex flex-col space-y-2 p-4 bg-gray-50 rounded-lg">
        {nodes.map(node => (
          <div 
            key={node.id} 
            className={`
              p-3 rounded-md cursor-pointer transition-all duration-200 
              ${selectedNodeId === node.id ? 'bg-blue-100 border-blue-300' : 'bg-white hover:bg-gray-100'}
              border
            `}
            onClick={() => setSelectedNodeId(node.id)}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">{node.author}</span>
              <span className="text-xs text-gray-500">
                {new Date(node.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{node.content}</p>
            {node.branchId && (
              <span className="text-xs text-green-600 mt-1 inline-block">
                Branch Point
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render the main component
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Conversation Explorer</h1>
          <div className="flex space-x-2">
            <button 
              onClick={createConversation}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
            >
              <Plus className="mr-2" size={20} /> New Conversation
            </button>
            <button 
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center"
              disabled={!activeConversationId}
            >
              <GitBranch className="mr-2" size={20} /> Branch
            </button>
          </div>
        </div>

        {/* Conversation Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Active Conversations</label>
          <div className="flex space-x-2 overflow-x-auto">
            {Object.values(conversations).map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`
                  px-4 py-2 rounded flex items-center 
                  ${activeConversationId === conv.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                `}
              >
                <MessageCircle className="mr-2" size={16} />
                {conv.name}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Nodes */}
        <div className="grid grid-cols-3 gap-4">
          {/* Nodes List */}
          <div className="col-span-2">
            {renderConversationNodes()}
          </div>

          {/* Node Details & Message Input */}
          <div className="col-span-1 bg-gray-100 p-4 rounded-lg">
            {selectedNodeId && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Node Details</h3>
                {/* Detailed node information would go here */}
              </div>
            )}

            <div className="mt-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-2 border rounded mb-2 min-h-[100px]"
              />
              <button
                onClick={addMessage}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationExplorer;
