export interface CrewMember {
  id: string;
  name: string;
  role: string;
  tools: string[];
  expertise?: string[];
  status?: 'active' | 'idle' | 'busy';
}

export interface CrewConfiguration {
  id: string;
  name: string;
  members: CrewMember[];
  tools: string[];
  createdAt: number;
  updatedAt: number;
}

export interface CrewState {
  activeCrews: CrewConfiguration[];
  selectedCrewId: string | null;
  isLoading: boolean;
  error: string | null;
}
