import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronRight, GitBranch, Search, Plus, X } from 'lucide-react';

// Type definitions
interface Message {
  id: number;
  content: string;
  timestamp: number;
  author: string;
  parentId?: number;
  branchId: number;
}

interface ConversationBranch {
  id: number;
  name: string;
  rootMessageId: number;
}

const LOCAL_STORAGE_KEY = 'multiverse-conversations';

const ConversationExplorer: React.FC = () => {
  // State management
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  });

  const [branches, setBranches] = useState<ConversationBranch[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}-branches`);
      return saved ? JSON.parse(saved) : [{ id: 1, name: 'Main Conversation', rootMessageId: 0 }];
    } catch (error) {
      console.error('Error loading branches:', error);
      return [{ id: 1, name: 'Main Conversation', rootMessageId: 0 }];
    }
  });

  const [currentBranchId, setCurrentBranchId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);

  // Persist data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}-branches`, JSON.stringify(branches));
    } catch (error) {
      console.error('Error saving branches:', error);
    }
  }, [branches]);

  // Message and branch creation utilities
  const createMessage = useCallback((content: string, parentId?: number) => {
    const newMessage: Message = {
      id: Date.now(), // Using timestamp as unique ID
      content,
      timestamp: Date.now(),
      author: 'User', // TODO: Replace with actual user identification
      parentId,
      branchId: parentId 
        ? messages.find(m => m.id === parentId)?.branchId || currentBranchId 
        : currentBranchId
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, [messages, currentBranchId]);

  const createBranch = useCallback((name: string, rootMessageId: number) => {
    const newBranch: ConversationBranch = {
      id: Date.now(), // Using timestamp as unique ID
      name,
      rootMessageId
    };

    setBranches(prev => [...prev, newBranch]);
    setCurrentBranchId(newBranch.id);
    return newBranch;
  }, []);

  // Filtering and navigation
  const filteredMessages = useMemo(() => {
    return messages
      .filter(m => 
        m.branchId === currentBranchId && 
        m.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, currentBranchId, searchTerm]);

  const getBranchMessages = useCallback((branchId: number) => {
    return messages.filter(m => m.branchId === branchId);
  }, [messages]);

  // Render methods
  const renderMessageNode = (message: Message) => (
    <div 
      key={message.id} 
      className={`p-3 border rounded-lg mb-2 cursor-pointer ${
        selectedMessageId === message.id ? 'bg-blue-100' : 'bg-white'
      } hover:bg-gray-50 transition-colors`}
      onClick={() => setSelectedMessageId(message.id)}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm">{message.author}</span>
        <span className="text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="mt-2 text-sm">{message.content}</p>
      {message.parentId && (
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <GitBranch size={12} className="mr-1" />
          Branched from message {message.parentId}
        </div>
      )}
    </div>
  );

  const renderBranchSelector = () => (
    <div className="p-2 bg-gray-100 overflow-x-auto">
      <div className="flex space-x-2">
        {branches.map(branch => (
          <button
            key={branch.id}
            className={`px-3 py-1 rounded-full text-sm ${
              currentBranchId === branch.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 border'
            }`}
            onClick={() => setCurrentBranchId(branch.id)}
          >
            {branch.name}
          </button>
        ))}
        <button 
          className="bg-green-500 text-white rounded-full p-1"
          onClick={() => createBranch(`Branch ${branches.length + 1}`, selectedMessageId || 0)}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );

  const renderSearchAndNewMessage = () => (
    <div className="p-2 bg-white border-t">
      <div className="flex items-center mb-2 bg-gray-100 rounded-lg">
        <Search size={16} className="ml-3 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-transparent focus:outline-none"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="mr-2 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="flex">
        <input 
          type="text" 
          placeholder="Type a new message..."
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
          className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button 
          onClick={() => {
            if (newMessageContent.trim()) {
              createMessage(newMessageContent, selectedMessageId || undefined);
              setNewMessageContent('');
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );

  const renderMessageDetails = () => {
    if (!selectedMessageId) return null;
    
    const selectedMessage = messages.find(m => m.id === selectedMessageId);
    if (!selectedMessage) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Message Details</h2>
            <button 
              onClick={() => setSelectedMessageId(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-2">
            <p><strong>Author:</strong> {selectedMessage.author}</p>
            <p><strong>Timestamp:</strong> {new Date(selectedMessage.timestamp).toLocaleString()}</p>
            <p><strong>Content:</strong> {selectedMessage.content}</p>
            {selectedMessage.parentId && (
              <p>
                <strong>Branched from:</strong> Message {selectedMessage.parentId}
              </p>
            )}
            <button 
              onClick={() => createBranch(`Branch from ${selectedMessage.id}`, selectedMessage.id)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Create Branch
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50">
      {renderBranchSelector()}
      
      <div className="flex-grow overflow-y-auto p-2">
        {filteredMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No messages in this branch. Start a conversation!
          </div>
        ) : (
          filteredMessages.map(renderMessageNode)
        )}
      </div>
      
      {renderSearchAndNewMessage()}
      
      {selectedMessageId && renderMessageDetails()}
    </div>
  );
};

export default ConversationExplorer;
