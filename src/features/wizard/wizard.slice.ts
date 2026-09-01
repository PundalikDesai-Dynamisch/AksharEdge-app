import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_AVATAR_ID } from '@/types/models';
import type { PermissionKind } from '@/services/permissions/permissionService';
import type { AvatarId, Gender, PermissionStatus, SchoolingLevel } from '@/types/models';
import type { ChildLocation } from '@/domain/entities/Child';
import type { AppError } from '@/domain/errors/AppError';

export type WizardStep = 'intro' | 'form' | 'avatar' | 'location' | 'camera' | 'confirmation';

export interface WizardState {
  mode: 'create' | 'edit';
  childId: string | null;        // edit mode
  step: WizardStep;
  name: string;
  avatarId: AvatarId;            // DEFAULT_AVATAR_ID initially, never null
  ageYears: number | null;
  schooling: SchoolingLevel | null;
  gender: Gender | null;
  location: ChildLocation | null;
  // Last known, for first paint only. NEVER the value that gates. See §0 addition 1.
  lastKnown: Record<PermissionKind, PermissionStatus>;
  status: 'idle' | 'saving' | 'error';
  error: AppError | null;
}

export const initialState: WizardState = {
  mode: 'create',
  childId: null,
  step: 'intro',
  name: '',
  avatarId: DEFAULT_AVATAR_ID,
  ageYears: null,
  schooling: null,
  gender: null,
  location: null,
  lastKnown: {
    location: 'denied',
    camera: 'denied',
  },
  status: 'idle',
  error: null,
};

const wizardSlice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<{ mode: 'create' | 'edit'; childId: string | null }>) {
      state.mode = action.payload.mode;
      state.childId = action.payload.childId;
    },
    setStep(state, action: PayloadAction<WizardStep>) {
      state.step = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setAvatarId(state, action: PayloadAction<AvatarId>) {
      state.avatarId = action.payload;
    },
    setAgeYears(state, action: PayloadAction<number | null>) {
      state.ageYears = action.payload;
    },
    setSchooling(state, action: PayloadAction<SchoolingLevel | null>) {
      state.schooling = action.payload;
    },
    setGender(state, action: PayloadAction<Gender | null>) {
      state.gender = action.payload;
    },
    setLocation(state, action: PayloadAction<ChildLocation | null>) {
      state.location = action.payload;
    },
    setLastKnownPermission(
      state,
      action: PayloadAction<{ kind: PermissionKind; status: PermissionStatus }>,
    ) {
      state.lastKnown[action.payload.kind] = action.payload.status;
    },
    resetWizard() {
      return initialState;
    },
    // The thunks will also dispatch status actions, but for simplicity we keep those
    // isolated to the thunks using extraReducers if needed, or we can just add them here.
    setStatus(state, action: PayloadAction<WizardState['status']>) {
      state.status = action.payload;
    },
    setError(state, action: PayloadAction<AppError | null>) {
      state.error = action.payload;
    },
    restoreDraft(state, action: PayloadAction<Partial<WizardState>>) {
      // Restore everything except permissions and status/error
      return {
        ...state,
        ...action.payload,
        lastKnown: state.lastKnown,
        status: 'idle',
        error: null,
      };
    },
  },
});

export const {
  setMode,
  setStep,
  setName,
  setAvatarId,
  setAgeYears,
  setSchooling,
  setGender,
  setLocation,
  setLastKnownPermission,
  resetWizard,
  setStatus,
  setError,
  restoreDraft,
} = wizardSlice.actions;

export const wizardReducer = wizardSlice.reducer;

// ---------------------------------------------------------------------------
// Validation Selectors
// ---------------------------------------------------------------------------
// Note: We use RootState here eventually, but for pure selectors on the slice state:

export const selectStep1Valid = (state: { wizard: WizardState }): boolean => {
  const w = state.wizard;
  return (
    w.name.trim().length > 0 &&
    w.ageYears !== null &&
    w.schooling !== null &&
    w.gender !== null
    // Avatar is always valid because it defaults to DEFAULT_AVATAR_ID
  );
};

export const selectCanReachConfirmation = (state: { wizard: WizardState }): boolean => {
  const w = state.wizard;
  // This selector must NOT consult lastKnown.
  // Reaching confirmation depends on a live OS check (Branch 24).
  // This just covers data fields.
  return selectStep1Valid(state) && w.location !== null;
};
