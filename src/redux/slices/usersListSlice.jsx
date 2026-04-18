import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllWalkers } from '../../services/walkerService';
import { getAllPets } from '../../services/petService';

// Thunk para obtener la lista de usuarios según el rol
export const fetchUsersList = createAsyncThunk(
  'usersList/fetchUsersList',
  async ({ role, location, limit = 20 }, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux - Fetching data for role:', role);
      
      // Owners ven walkers, Walkers ven perros
      const data = role === 'owner' 
        ? await getAllWalkers(location, limit)
        : await getAllPets(location, limit);
      
      console.log('✅ Redux - Data received:', data);
      console.log('📊 Redux - Data count:', data?.length || 0);
      
      return { data, role };
    } catch (error) {
      console.error('❌ Redux - Error fetching data:', error);
      return rejectWithValue(error.message || 'Error al cargar datos');
    }
  }
);

const usersListSlice = createSlice({
  name: 'usersList',
  initialState: {
    users: [],
    loading: false,
    error: null,
    role: null, // 'owner' o 'walker' - indica qué tipo de lista estamos mostrando
  },
  reducers: {
    clearUsersList: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUsersList } = usersListSlice.actions;
export default usersListSlice.reducer;
