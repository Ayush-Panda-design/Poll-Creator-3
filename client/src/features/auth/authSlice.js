import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Async Thunks ─────────────────────────────────────────────────────────────
export const signupUser = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/signup', data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await api.post('/auth/logout'); } catch { /* ignore */ }
  localStorage.removeItem('token');
});

export const completeOnboarding = createAsyncThunk('auth/onboarding', async (data, { rejectWithValue }) => {
  try {
    const res = await api.patch('/users/onboarding', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Onboarding failed');
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('token'), loading: false, error: null },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser:    (state, action) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    const pending   = (state)         => { state.loading = true; state.error = null; };
    const rejected  = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(signupUser.pending, pending)
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, rejected)

      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, rejected)

      .addCase(fetchMe.pending, pending)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user;
      })
      .addCase(fetchMe.rejected, (state) => { state.loading = false; state.user = null; state.token = null; })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; state.token = null;
      })

      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
