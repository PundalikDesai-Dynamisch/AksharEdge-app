import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from '@features/auth/auth.slice';

/**
 * Grows to the full doc 16 §2 shape (auth, students, uploads, network, ui) as each phase
 * lands its slice. Only `auth` exists in Phase 0.
 */
export const rootReducer = combineReducers({
  auth: authReducer,
});
