import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Child } from '@/domain/entities/Child';
import { buildRepositories } from '@/data/container';
import { signOutThunk } from '@features/auth/auth.thunks';
import type { Unsubscribe } from '@/data/repositories/types';

export interface ChildrenState {
  data: Child[];
  loading: boolean;
  error: string | null;
}

const initialState: ChildrenState = {
  data: [],
  loading: true, // true by default so it spins on first mount instead of briefly showing empty
  error: null,
};

// Module-level reference to the active subscription so we can clean it up.
let unsubscribeFromChildren: Unsubscribe | null = null;

export const startChildrenSubscription = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'children/startSubscription',
  async (parentId, { dispatch, rejectWithValue }) => {
    // If we're already subscribed, clean up first
    if (unsubscribeFromChildren) {
      unsubscribeFromChildren();
      unsubscribeFromChildren = null;
    }

    try {
      const { children } = buildRepositories();
      unsubscribeFromChildren = children.observeByParent(
        parentId,
        (data: Child[]) => {
          dispatch(childrenUpdated(data));
        },
        (error: unknown) => {
          dispatch(childrenError(error instanceof Error ? error.message : String(error)));
        }
      );
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
    }
  }
);

export const stopChildrenSubscription = createAsyncThunk(
  'children/stopSubscription',
  async () => {
    if (unsubscribeFromChildren) {
      unsubscribeFromChildren();
      unsubscribeFromChildren = null;
    }
  }
);

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    childrenUpdated(state, action: PayloadAction<Child[]>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    childrenError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Automatically stop subscription and clear state when signing out
    builder.addCase(signOutThunk.fulfilled, (state) => {
      if (unsubscribeFromChildren) {
        unsubscribeFromChildren();
        unsubscribeFromChildren = null;
      }
      state.data = [];
      state.loading = true;
      state.error = null;
    });
    
    // Also stop subscription if signout is pending or rejected to be safe
    builder.addCase(signOutThunk.pending, () => {
      if (unsubscribeFromChildren) {
        unsubscribeFromChildren();
        unsubscribeFromChildren = null;
      }
    });
  },
});

export const { childrenUpdated, childrenError } = childrenSlice.actions;
export const childrenReducer = childrenSlice.reducer;
