import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

// Helper function to safely get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const initialState = {
  user: null,
  token: getToken(),
  isAuthenticated: false,
  loading: false,
  error: null,
  role: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/users/login', credentials);
      console.log('Login response:', response.data); // Debug log
      
      // Check if we have a valid response with user data and token
      if (response.data && response.data.data) {
        const { user, token } = response.data.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        return {
          success: true,
          data: {
            user,
            token
          }
        };
      }
      return rejectWithValue({ message: 'Invalid response format from server' });
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/users/register', userData);
      if (response.data && response.data.data) {
        const { user, token } = response.data.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        return {
          success: true,
          data: {
            user,
            token
          }
        };
      }
      return rejectWithValue({ message: 'Invalid response format from server' });
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Login fulfilled:', action.payload); // Debug log
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.role = action.payload.data.user.role;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        console.log('Login rejected:', action.payload); // Debug log
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.role = action.payload.data.user.role;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.role = null;
      });
  },
});

export const { clearError, setUserRole } = authSlice.actions;
export default authSlice.reducer; 