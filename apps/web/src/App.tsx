import React from 'react';
import CrewFactory from '@/components/CrewFactory';
import { MessageCircle, Users, Settings, GitBranch } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold">CrewAI Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Users className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <GitBranch className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Crew Factory</h1>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                New Crew
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Import
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* CrewFactory Component */}
        <div className="bg-white rounded-lg shadow-sm">
          <CrewFactory
            onCreateCrew={(crew) => {
              console.log('New crew created:', crew);
            }}
          />
        </div>

        {/* Status Bar */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <span>Connected to Ollama</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                <span>3 Models Active</span>
              </div>
            </div>
            <div>
              Version 0.1.0
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;