import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Thunks ────────────────────────────────────────────────────────────────────
export const fetchPolls = createAsyncThunk('polls/fetchAll', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/polls'); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch polls'); }
});

export const fetchPollById = createAsyncThunk('polls/fetchById', async (id, { rejectWithValue }) => {
  try { const res = await api.get(`/polls/${id}`); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Poll not found'); }
});

export const createPoll = createAsyncThunk('polls/create', async (data, { rejectWithValue }) => {
  try { const res = await api.post('/polls', data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to create poll'); }
});

export const updatePoll = createAsyncThunk('polls/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await api.patch(`/polls/${id}`, data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update poll'); }
});

export const deletePoll = createAsyncThunk('polls/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/polls/${id}`); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete poll'); }
});

export const publishPoll = createAsyncThunk('polls/publish', async (id, { rejectWithValue }) => {
  try { const res = await api.post(`/polls/${id}/publish`); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to publish poll'); }
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const pollSlice = createSlice({
  name: 'polls',
  initialState: { polls: [], currentPoll: null, loading: false, error: null },
  reducers: {
    clearPollError: (state) => { state.error = null; },
    setCurrentPoll: (state, action) => { state.currentPoll = action.payload; },
    incrementResponseCount: (state, action) => {
      const poll = state.polls.find((p) => p._id === action.payload);
      if (poll) poll.totalResponses = (poll.totalResponses || 0) + 1;
    },
  },
  extraReducers: (builder) => {
    const pending  = (state)         => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchPolls.pending, pending)
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false; state.polls = action.payload.polls;
      })
      .addCase(fetchPolls.rejected, rejected)

      .addCase(fetchPollById.pending, pending)
      .addCase(fetchPollById.fulfilled, (state, action) => {
        state.loading = false; state.currentPoll = action.payload.poll;
      })
      .addCase(fetchPollById.rejected, rejected)

      .addCase(createPoll.pending, pending)
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false; state.polls.unshift(action.payload.poll);
      })
      .addCase(createPoll.rejected, rejected)

      .addCase(updatePoll.fulfilled, (state, action) => {
        const idx = state.polls.findIndex((p) => p._id === action.payload.poll._id);
        if (idx !== -1) state.polls[idx] = action.payload.poll;
        state.currentPoll = action.payload.poll;
      })

      .addCase(deletePoll.fulfilled, (state, action) => {
        state.polls = state.polls.filter((p) => p._id !== action.payload);
      })

      .addCase(publishPoll.fulfilled, (state, action) => {
        const idx = state.polls.findIndex((p) => p._id === action.payload.poll._id);
        if (idx !== -1) state.polls[idx] = action.payload.poll;
        state.currentPoll = action.payload.poll;
      });
  },
});

export const { clearPollError, setCurrentPoll, incrementResponseCount } = pollSlice.actions;
export default pollSlice.reducer;
