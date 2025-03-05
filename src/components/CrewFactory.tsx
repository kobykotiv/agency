import React, { useState, useEffect } from 'react';
import { DemoModeService } from '../services/demoMode';
import { Card } from '@/components/ui/card';
import { Brain, Tool, Users } from 'lucide-react';

interface CrewMember {
  id: string;
  name: string;
  role: string;
  tools: string[];
}

export const CrewFactory: React.FC = () => {
  const [crewName, setCrewName] = useState('');
  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState('');
  const demoService = DemoModeService.getInstance();

  const [members, setMembers] = useState<CrewMember[]>([]);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
  });

  const handleCreateCrew = async () => {
    const config = { tools };
    await demoService.createCrew(crewName, config);
    setCrewName('');
    setTools([]);
  };

  const handleExport = () => {
    const exportData = demoService.exportCrew(crewName);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${crewName}-crew.json`;
    a.click();
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      setMembers([...members, {
        id: Date.now().toString(),
        ...newMember,
        tools: tools,
      }]);
      setNewMember({ name: '', role: '' });
      setTools([]);
    }
  };

  return (
    <Card className="crew-factory p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Users className="mr-2" /> Crew Factory
      </h2>
      <div>
        <input
          value={crewName}
          onChange={(e) => setCrewName(e.target.value)}
          placeholder="Crew Name"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            <Brain className="mr-2" /> Crew Members
          </h3>
          <div>
            <input
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="Member Name"
            />
            <input
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              placeholder="Member Role"
            />
            <button onClick={handleAddMember}>Add Member</button>
          </div>
          <div>
            {members.map((member) => (
              <div key={member.id}>
                {member.name} - {member.role}
                <button onClick={() => setMembers(members.filter((m) => m.id !== member.id))}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            <Tool className="mr-2" /> Tools
          </h3>
          <div>
            <input
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              placeholder="Add Tool"
            />
            <button
              onClick={() => {
                setTools([...tools, newTool]);
                setNewTool('');
              }}
            >
              Add Tool
            </button>
          </div>
          <div>
            {tools.map((tool, index) => (
              <div key={index}>
                {tool}
                <button onClick={() => setTools(tools.filter((_, i) => i !== index))}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={handleCreateCrew}>Create Crew</button>
      <button onClick={handleExport}>Export Crew</button>
    </Card>
  );
};
