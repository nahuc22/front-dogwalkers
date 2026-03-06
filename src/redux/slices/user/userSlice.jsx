import { createSlice } from '@reduxjs/toolkit';
import { login, register } from '../../actions/users/userAction';

const initialState = {
    id: null,
    name: '',
    email: '',
    isAuthenticated: false,
    loading: false,
    error: null,
    registerStatus: {
      loading: false,
      success: false,
      error: null,
    }
  };
  
  const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      logout: (state) => {
        state.id = null;
        state.name = '';
        state.email = '';
        state.isAuthenticated = false;
      },
    },
    extraReducers: (builder) => {
      // Login
      builder.addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.isAuthenticated = true;
        state.error = null;
      });
      builder.addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
      
      // Register
      builder.addCase(register.pending, (state) => {
        state.registerStatus.loading = true;
        state.registerStatus.error = null;
      });
      builder.addCase(register.fulfilled, (state) => {
        state.registerStatus.loading = false;
        state.registerStatus.success = true;
        state.registerStatus.error = null;
      });
      builder.addCase(register.rejected, (state, action) => {
        state.registerStatus.loading = false;
        state.registerStatus.success = false;
        state.registerStatus.error = action.payload;
      });
    }
  });

export const { logout } = userSlice.actions;
export default userSlice.reducer;