import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import pollReducer from '../features/polls/pollSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    polls: pollReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
