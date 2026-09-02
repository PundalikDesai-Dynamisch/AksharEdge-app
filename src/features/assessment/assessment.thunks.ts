import { createAsyncThunk } from '@reduxjs/toolkit';

import type { AppDispatch, RootState } from '@/store';
import { buildRepositories } from '@/data/container';
import { buildMissionPlan } from '@/domain/policies/assessmentPolicy';
import { APP_VERSION } from '@/constants/config';
import type { Unsubscribe } from '@/data/repositories/types';
import type { Assessment } from '@/domain/entities/Assessment';
import type { SaveGameResultInput } from '@/data/repositories/assessmentRepository';
import type { SchoolingLevel } from '@/types/models';

import { assessmentUpdated, assessmentError, setAssessmentChildId } from './assessment.slice';

// Keep track of the active subscription per child
let unsubscribeFromAssessment: Unsubscribe | null = null;
let currentSubscribedChildId: string | null = null;

export const startAssessmentSubscription = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; rejectValue: string; state: RootState }
>(
  'assessment/startSubscription',
  async (childId, { dispatch, rejectWithValue, getState }) => {
    // If we're already subscribed to this exact child, do nothing
    if (unsubscribeFromAssessment && currentSubscribedChildId === childId) {
      return;
    }

    // Clean up any existing subscription for a different child
    if (unsubscribeFromAssessment) {
      unsubscribeFromAssessment();
      unsubscribeFromAssessment = null;
      currentSubscribedChildId = null;
    }

    dispatch(setAssessmentChildId(childId));

    try {
      const { assessments: assessmentRepo } = buildRepositories();
      const parentId = getState().auth.parent?.parentId;
      
      if (!parentId) {
        return rejectWithValue('User must be signed in to load assessment');
      }

      currentSubscribedChildId = childId;
      unsubscribeFromAssessment = assessmentRepo.observeLatestForChild(
        childId,
        parentId,
        (data: Assessment | null) => {
          dispatch(assessmentUpdated({ childId, assessment: data }));
        },
        (error: unknown) => {
          dispatch(assessmentError(error instanceof Error ? error.message : String(error)));
        }
      );
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
    }
  }
);

export const stopAssessmentSubscription = createAsyncThunk(
  'assessment/stopSubscription',
  async () => {
    if (unsubscribeFromAssessment) {
      unsubscribeFromAssessment();
      unsubscribeFromAssessment = null;
      currentSubscribedChildId = null;
    }
  }
);

export interface StartAssessmentParams {
  childId: string;
  parentId: string;
  ageYears: number;
  schooling: SchoolingLevel;
}

export const startAssessment = createAsyncThunk<
  void,
  StartAssessmentParams,
  { state: RootState; rejectValue: string }
>(
  'assessment/startAssessment',
  async ({ childId, parentId, ageYears, schooling }, { getState, rejectWithValue }) => {
    const state = getState();
    const currentAssessment = state.assessment.assessment;

    // Idempotent start: if there is already an in_progress assessment, we just resume
    if (currentAssessment && currentAssessment.status === 'in_progress') {
      return;
    }

    try {
      const { assessments: assessmentRepo } = buildRepositories();
      const missionPlan = buildMissionPlan({ ageYears, schooling });

      // We resolve the band from the first game in the plan (they all map to the same band anyway)
      // or we can resolve it directly here if we had access to `resolveAgeBand`.
      // Let's resolve it directly:
      const { resolveAgeBand } = await import('@/domain/policies/assessmentPolicy');
      const ageBand = resolveAgeBand({ ageYears, schooling });

      await assessmentRepo.create({
        childId,
        parentId,
        ageBand,
        missionPlan,
        appVersion: APP_VERSION,
        unityBuildId: null, // Stay null until Phase 5
      });

      // We don't need to dispatch an update manually because the snapshot listener
      // will pick up the new document and update the state automatically.
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
    }
  }
);

export const recordGameResult = createAsyncThunk<
  void,
  SaveGameResultInput,
  { rejectValue: string }
>(
  'assessment/recordGameResult',
  async (input, { rejectWithValue }) => {
    try {
      const { assessments: assessmentRepo } = buildRepositories();
      await assessmentRepo.saveGameResult(input);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
    }
  }
);

export const submitAssessment = createAsyncThunk<
  void,
  string, // assessmentId
  { rejectValue: string }
>(
  'assessment/submitAssessment',
  async (assessmentId, { rejectWithValue }) => {
    try {
      const { assessments: assessmentRepo } = buildRepositories();
      await assessmentRepo.markSubmitted(assessmentId);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
    }
  }
);

export interface UploadWritingSampleParams {
  localUri: string;
  mimeType: string;
  sizeBytes: number;
  assessmentId: string;
  promptText: string;
  retakeCount: number;
  parentId: string;
  childId: string;
  fileName: string;
}

export const uploadWritingSample = createAsyncThunk<
  void,
  UploadWritingSampleParams,
  { rejectValue: string }
>(
  'assessment/uploadWritingSample',
  async (
    { localUri, mimeType, sizeBytes, assessmentId, promptText, retakeCount, parentId, childId, fileName },
    { rejectWithValue }
  ) => {
    // 1. Enforce the 25 MB limit before even trying Firebase
    if (sizeBytes > 25 * 1024 * 1024) {
      return rejectWithValue("This photo is too large. Please take a photo under 25 MB.");
    }

    const { assessments: assessmentRepo, media: mediaRepo } = buildRepositories();
    const storagePath = mediaRepo.buildWritingPath({ parentId, childId, assessmentId, fileName });

    try {
      // 2. Upload the image
      const uploadedImage = await mediaRepo.uploadImage({ localUri, storagePath, mimeType });
      
      // 3. Save the success status
      await assessmentRepo.saveWritingSample({
        assessmentId,
        storagePath,
        downloadUrl: uploadedImage.downloadUrl,
        promptText,
        mimeType,
        sizeBytes,
        retakeCount,
      });
    } catch (error: any) {
      // AppError is thrown from firebaseMediaRepository
      if (error && typeof error === 'object' && 'retryable' in error) {
        if (error.retryable) {
          // Pass it up to the UI so it can offer a retry
          throw error;
        } else {
          // Hard failure (e.g. storage/unauthorized)
          await assessmentRepo.saveWritingSample({
            assessmentId,
            storagePath,
            downloadUrl: null, // this saves status: 'failed'
            promptText,
            mimeType,
            sizeBytes,
            retakeCount,
          });
          return rejectWithValue(error.message);
        }
      }

      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);
