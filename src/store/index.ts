import { configureStore } from '@reduxjs/toolkit';

import { buildRepositories } from '@data/container';

import type { Repositories } from '@data/container';

import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefault =>
    getDefault({
      // Repositories are injected rather than imported by thunks, so the data layer can be
      // swapped without touching a single thunk.
      thunk: { extraArgument: buildRepositories() },
      // Firestore Timestamp objects are converted to ISO strings by mappers before they reach
      // Redux, so this stays strict. If a serializable warning appears, a mapper is missing —
      // do not silence it here.
      serializableCheck: { ignoredActions: [] },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

/** The shape thunks declare so `extra` is typed rather than `unknown`. */
export interface ThunkExtra {
  readonly extra: Repositories;
  readonly state: RootState;
  readonly dispatch: AppDispatch;
}
