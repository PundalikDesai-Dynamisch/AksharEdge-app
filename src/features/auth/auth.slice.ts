import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { Parent } from '@/domain/entities/Parent';
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
  parent: Parent | null;
  isSubmitting: boolean;
  error: { code: string; userMessage: string } | null;
}

/**
 * `unknown` rather than `signedOut` is deliberate: collapsing the two flashes the Welcome
 * screen for ~300ms on every launch for an already-signed-in parent (doc 06 §5).
 */
const initialState: AuthState = {
  status: 'unknown',
  parent: null,
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
     * `status`/`parent` (doc 16 §3). In Phase 0 the Splash/Welcome/Settings stubs dispatch it
     * directly, which is the hardcoded gate toggle doc 06 §11 asks for.
     */
    setAuthState(
      state,
      action: PayloadAction<{ status: AuthStatus; parent: Parent | null }>,
    ): void {
      state.status = action.payload.status;
      state.parent = action.payload.parent;
      state.error = null;
    },

    clearAuthError(state): void {
      state.error = null;
    },

    incrementChildCount(state): void {
      if (state.parent) {
        state.parent.childCount += 1;
      }
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

export const { setAuthState, clearAuthError, incrementChildCount } = authSlice.actions;
export const authReducer = authSlice.reducer;

/**
 * SELECTORS
 */

/**
 * Branch 17 / Phase 2 Note:
 * This selector instantly determines whether a signed-in parent should be routed to the 
 * Empty State (carousel) or the Populated State (child list), without needing an extra Firestore query.
 * 
 * IMPORTANT: Who owns the childCount increment?
 * A Cloud Function trigger on the `children` collection creation will own incrementing this `childCount`.
 * We deliberately do NOT run a client-side transaction in the wizard to avoid drift 
 * (e.g. if the user loses connection right after creating the child).
 */
export const selectHasChildren = (state: { auth: AuthState }): boolean => {
  return (state.auth.parent?.childCount ?? 0) > 0;
};
