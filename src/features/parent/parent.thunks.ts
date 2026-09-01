import { createAsyncThunk } from '@reduxjs/toolkit';

import { buildRepositories } from '@/data/container';
import type { UpdateParentInput } from '@/data/repositories/parentRepository';
import { setAuthState } from '@/features/auth/auth.slice';
import type { RootState } from '@/store';
import { authService } from '@/services/firebase/authService';

// We put soft delete here because it's a discrete action (not part of the children live sync).
export const softDeleteChildThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'parent/softDeleteChild',
  async (childId, { rejectWithValue }) => {
    try {
      const { children } = buildRepositories();
      await children.softDelete(childId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete child');
    }
  }
);

export type UpdateParentPayload = UpdateParentInput & { password?: string };

export const updateParentThunk = createAsyncThunk<
  void,
  UpdateParentPayload,
  { state: RootState; rejectValue: string }
>(
  'parent/updateParent',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const parentId = state.auth.parent?.parentId;
      if (!parentId) {
        throw new Error('No parent signed in');
      }

      const { password, ...patch } = payload;

      // Update password first if provided
      if (password) {
        await authService.updatePassword(password);
      }

      // Only hit Firestore if there are fields to update
      if (Object.keys(patch).length > 0) {
        const { parents } = buildRepositories();
        await parents.update(parentId, patch);
        
        // Re-fetch to ensure completeness instead of complex manual merge
        if (state.auth.parent) {
          const updatedParent = await parents.fetchOrCreate({
              parentId: state.auth.parent.parentId,
              fullName: state.auth.parent.fullName,
              email: state.auth.parent.email,
              phone: state.auth.parent.phone,
              contactMethod: state.auth.parent.contactMethod,
              authProvider: state.auth.parent.authProvider,
              location: state.auth.parent.location,
          }); 
          dispatch(setAuthState({ status: 'signedIn', parent: updatedParent }));
        }
      }
      
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update parent details');
    }
  }
);
