import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { RootState } from '@/store';
import type { WizardState } from './wizard.slice';
import { restoreDraft } from './wizard.slice';

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
