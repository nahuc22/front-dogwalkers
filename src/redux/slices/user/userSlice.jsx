import { createSlice } from '@reduxjs/toolkit';
import { login, register, updateProfile } from '../../actions/users/userAction';

const initialState = {
  userId: null,
  email: '',
  role: null,
  profile: null, // Contendrá todos los datos del perfil (owner/walker/admin)
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
      state.userId = null;
      state.email = '';
      state.role = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.registerStatus = {
        loading: false,
        success: false,
        error: null,
      };
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
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.profile = action.payload.profile;
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
      if (!state.registerStatus) {
        state.registerStatus = { loading: false, success: false, error: null };
      }
      state.registerStatus.loading = true;
      state.registerStatus.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      if (!state.registerStatus) {
        state.registerStatus = { loading: false, success: false, error: null };
      }
      state.registerStatus.loading = false;
      state.registerStatus.success = true;
      state.registerStatus.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      if (!state.registerStatus) {
        state.registerStatus = { loading: false, success: false, error: null };
      }
      state.registerStatus.loading = false;
      state.registerStatus.success = false;
      state.registerStatus.error = action.payload;
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload; // Actualizar perfil con datos del backend
      state.error = null;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
