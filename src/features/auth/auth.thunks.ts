import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppError } from '@/domain/errors/AppError';
import { authService } from '@/services/firebase/authService';
import { mapAuthError } from '@/services/firebase/errorMap';

interface SerializedError {
  code: string;
  userMessage: string;
}

const serializeError = (e: unknown): SerializedError => {
  const appError = e instanceof AppError ? e : mapAuthError(e);
  return { code: appError.code, userMessage: appError.userMessage };
};

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (params: { fullName: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      await authService.registerWithEmail(params.fullName, params.email, params.password);
    } catch (e) {
      return rejectWithValue(serializeError(e));
    }
  },
);

export const signInThunk = createAsyncThunk(
  'auth/signIn',
  async (params: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await authService.signInWithEmail(params.email, params.password);
    } catch (e) {
      return rejectWithValue(serializeError(e));
    }
  },
);

export const signInWithGoogleThunk = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      await authService.signInWithGoogle();
    } catch (e) {
      if (e instanceof AppError && e.code === 'AUTH_CANCELLED') {
        // Return normally so we don't set an error in state for cancellation
        return;
      }
      return rejectWithValue(serializeError(e));
    }
  },
);

export const sendPasswordResetThunk = createAsyncThunk(
  'auth/sendPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.sendPasswordReset(email);
    } catch (e) {
      return rejectWithValue(serializeError(e));
    }
  },
);

export const signOutThunk = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await authService.signOut();
    } catch (e) {
      return rejectWithValue(serializeError(e));
    }
  },
);
