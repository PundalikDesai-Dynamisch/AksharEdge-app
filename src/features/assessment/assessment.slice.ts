import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Assessment } from '@/domain/entities/Assessment';
import { signOutThunk } from '@features/auth/auth.thunks';

export interface AssessmentState {
  childId: string | null;
  assessment: Assessment | null;
  loading: boolean;
  error: string | null;
  currentMissionIndex: number;
}

const initialState: AssessmentState = {
  childId: null,
  assessment: null,
  loading: false,
  error: null,
  currentMissionIndex: 0,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    assessmentUpdated(
      state,
      action: PayloadAction<{ childId: string; assessment: Assessment | null }>
    ) {
      state.childId = action.payload.childId;
      // @ts-ignore: immer readonly draft issue
      state.assessment = action.payload.assessment;
      state.loading = false;
      state.error = null;
    },
    assessmentError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    setAssessmentLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAssessmentChildId(state, action: PayloadAction<string>) {
      state.childId = action.payload;
      state.loading = true;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signOutThunk.fulfilled, (state) => {
      state.childId = null;
      state.assessment = null;
      state.loading = false;
      state.error = null;
      state.currentMissionIndex = 0;
    });
  },
});

export const { assessmentUpdated, assessmentError, setAssessmentLoading, setAssessmentChildId } = assessmentSlice.actions;
export const assessmentReducer = assessmentSlice.reducer;
