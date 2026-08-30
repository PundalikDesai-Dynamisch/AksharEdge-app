import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { Teacher } from '@/domain/entities/Teacher';
import type { AuthStatus } from '@/types/models';

import {
  registerThunk,
  signInThunk,
  signInWithGoogleThunk,
  sendPasswordResetThunk,
  signOutThunk,
} from './auth.thunks';

export interface AuthState {
  status: AuthStatus;
  teacher: Teacher | null;
  isSubmitting: boolean;
  error: { code: string; userMessage: string } | null;
}

/**
 * `unknown` rather than `signedOut` is deliberate: collapsing the two flashes the Welcome
 * screen for ~300ms on every launch for an already-signed-in teacher (doc 06 §5).
 */
const initialState: AuthState = {
  status: 'unknown',
  teacher: null,
  isSubmitting: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * From Phase 1 on, dispatched only by the `onAuthStateChanged` listener in bootstrap.ts —
     * never from a thunk's `fulfilled` handler, so there is exactly one writer of
     * `status`/`teacher` (doc 16 §3). In Phase 0 the Splash/Welcome/Settings stubs dispatch it
     * directly, which is the hardcoded gate toggle doc 06 §11 asks for.
     */
    setAuthState(
      state,
      action: PayloadAction<{ status: AuthStatus; teacher: Teacher | null }>,
    ): void {
      state.status = action.payload.status;
      state.teacher = action.payload.teacher;
      state.error = null;
    },

    clearAuthError(state): void {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const thunks = [registerThunk, signInThunk, signInWithGoogleThunk, sendPasswordResetThunk, signOutThunk];
    
    thunks.forEach((thunk) => {
      builder.addCase(thunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      });
      builder.addCase(thunk.fulfilled, (state) => {
        state.isSubmitting = false;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) {
          state.error = action.payload as { code: string; userMessage: string };
        }
      });
    });
  },
});

export const { setAuthState, clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;
