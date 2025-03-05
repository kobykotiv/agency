import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CrewState, CrewConfiguration, CrewMember } from '../interfaces/crew';

const initialState: CrewState = {
  activeCrews: [],
  selectedCrewId: null,
  isLoading: false,
  error: null,
};

export const crewSlice = createSlice({
  name: 'crew',
  initialState,
  reducers: {
    addCrew: (state, action: PayloadAction<CrewConfiguration>) => {
      state.activeCrews.push(action.payload);
    },
    updateCrew: (state, action: PayloadAction<CrewConfiguration>) => {
      const index = state.activeCrews.findIndex(crew => crew.id === action.payload.id);
      if (index !== -1) {
        state.activeCrews[index] = action.payload;
      }
    },
    selectCrew: (state, action: PayloadAction<string>) => {
      state.selectedCrewId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addCrew, updateCrew, selectCrew, setLoading, setError } = crewSlice.actions;
export default crewSlice.reducer;
