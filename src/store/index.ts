import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefault =>
    getDefault({
      // Firebase Timestamp/FieldValue objects are converted to ISO strings by mappers before
      // they reach Redux (doc 09 §9), so this stays strict. If a serializable warning appears,
      // a mapper is missing — do not silence it here (doc 16 §2).
      serializableCheck: { ignoredActions: [] },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
