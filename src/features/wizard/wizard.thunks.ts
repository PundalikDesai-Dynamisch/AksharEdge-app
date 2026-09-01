import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { RootState } from '@/store';


// Scope draft keys to the parentId so we don't leak partial data across accounts
const getDraftKey = (parentId: string): string => `wizard.draft.${parentId}`;

// We debounce the save inside the component layer using a debounced effect, 
// or by only dispatching this on meaningful blur/next events.
// The thunk itself just performs the async write.
export const saveDraft = createAsyncThunk<
  void,
  string, // parentId
  { state: RootState }
>(
  'wizard/saveDraft',
  async (parentId, { getState }) => {
    const wizardState = getState().wizard;

    // NEVER persist permission status to the draft.
    // Restoring a stale 'granted' unlocks a step erroneously.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { lastKnown, status, error, ...draftPayload } = wizardState;

    const key = getDraftKey(parentId);
    await AsyncStorage.setItem(key, JSON.stringify(draftPayload));
  }
);

export const loadDraft = createAsyncThunk<
  void,
  string, // parentId
  { state: RootState }
>(
  'wizard/loadDraft',
  async (parentId, { dispatch }) => {
    const key = getDraftKey(parentId);
    const json = await AsyncStorage.getItem(key);

    if (json) {
      try {
        const payload: Partial<WizardState> = JSON.parse(json);
        dispatch(restoreDraft(payload));
      } catch (e) {
        // Corrupted draft; ignore and let the initial state take over
        // eslint-disable-next-line no-console
        console.warn('Failed to parse wizard draft', e);
      }
    }
  }
);

export const clearDraft = createAsyncThunk<
  void,
  string // parentId
>(
  'wizard/clearDraft',
  async (parentId) => {
    const key = getDraftKey(parentId);
    await AsyncStorage.removeItem(key);
  }
);

import { firebaseChildRepository } from '@/data/firebase/firebaseChildRepository';
import { firebaseParentRepository } from '@/data/firebase/firebaseParentRepository';
import { incrementChildCount } from '@/features/auth/auth.slice';
import type { CreateChildInput } from '@/data/repositories/childRepository';

import { restoreDraft } from './wizard.slice';
import type { WizardState } from './wizard.slice';

export const loadChildForEdit = createAsyncThunk<
  void,
  string, // childId
  { state: RootState }
>(
  'wizard/loadChildForEdit',
  async (childId, { dispatch }) => {
    const child = await firebaseChildRepository.get(childId);
    dispatch(restoreDraft({
      name: child.name,
      avatarId: child.avatarId,
      ageYears: child.ageYears,
      schooling: child.schooling,
      gender: child.gender,
    }));
  }
);

export const createChildAndClearDraft = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'wizard/createChildAndClearDraft',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const wizardState = state.wizard;
    const parentId = state.auth.parent?.parentId;

    if (!parentId) {
      throw new Error('Cannot create child: no parent signed in.');
    }

    const input: CreateChildInput = {
      parentId,
      name: wizardState.name.trim(),
      avatarId: wizardState.avatarId!,
      ageYears: wizardState.ageYears!,
      schooling: wizardState.schooling!,
      gender: wizardState.gender!,
      location: null,
    };

    // 1. Create the child
    await firebaseChildRepository.create(input);

    // 2. Client-side increment of childCount since we have no Cloud Functions yet (MVP Phase 3)
    const currentCount = state.auth.parent?.childCount ?? 0;
    await firebaseParentRepository.update(parentId, { childCount: currentCount + 1 });

    // 3. Update Redux auth state instantly
    dispatch(incrementChildCount());

    // 4. Clear the draft
    dispatch(clearDraft(parentId));
  }
);
