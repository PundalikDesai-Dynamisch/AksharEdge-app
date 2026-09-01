import {
  initialState,
  wizardReducer,
  restoreDraft,
  selectStep1Valid,
  selectCanReachConfirmation,
} from '../wizard.slice';
import type { WizardState } from '../wizard.slice';

describe('wizard.slice', () => {
  let state: { wizard: WizardState };

  beforeEach(() => {
    state = { wizard: { ...initialState } };
  });

  describe('validation selectors', () => {
    it('selectStep1Valid is false initially', () => {
      expect(selectStep1Valid(state)).toBe(false);
    });

    it('selectStep1Valid is false with empty name', () => {
      state.wizard.name = '   ';
      state.wizard.ageYears = 5;
      state.wizard.schooling = 'preK';
      state.wizard.gender = 'male';
      expect(selectStep1Valid(state)).toBe(false);
    });

    it('selectStep1Valid is true with all fields filled', () => {
      state.wizard.name = 'Ravi';
      state.wizard.ageYears = 5;
      state.wizard.schooling = 'preK';
      state.wizard.gender = 'male';
      // avatar is already DEFAULT_AVATAR_ID
      expect(selectStep1Valid(state)).toBe(true);
    });

    it('selectCanReachConfirmation is false if step 1 is invalid', () => {
      state.wizard.location = {
        label: 'Mumbai',
        lat: 12.9716,
        lng: 77.5946,
        capturedAt: new Date().toISOString(),
      };
      expect(selectCanReachConfirmation(state)).toBe(false);
    });

    it('selectCanReachConfirmation is false if location is missing', () => {
      state.wizard.name = 'Ravi';
      state.wizard.ageYears = 5;
      state.wizard.schooling = 'preK';
      state.wizard.gender = 'male';
      expect(selectCanReachConfirmation(state)).toBe(false);
    });

    it('selectCanReachConfirmation is true if step 1 valid and location present (ignores permissions)', () => {
      state.wizard.name = 'Ravi';
      state.wizard.ageYears = 5;
      state.wizard.schooling = 'preK';
      state.wizard.gender = 'male';
      state.wizard.location = {
        label: 'Mumbai',
        lat: 12.9716,
        lng: 77.5946,
        capturedAt: new Date().toISOString(),
      };
      
      // Even if lastKnown permissions are denied, they are ignored for reaching confirmation.
      // The OS check handles real permissions on the confirmation screen itself.
      state.wizard.lastKnown = {
        location: 'denied',
        camera: 'denied',
      };

      expect(selectCanReachConfirmation(state)).toBe(true);
    });
  });

  describe('draft restoration', () => {
    it('restores draft fields while keeping permissions intact', () => {
      // Set current permissions
      state.wizard.lastKnown = {
        location: 'granted',
        camera: 'denied',
      };

      // Payload from a loaded draft
      const draftPayload: Partial<WizardState> = {
        name: 'Restored Name',
        ageYears: 6,
        step: 'avatar',
      };

      const newState = wizardReducer(state.wizard, restoreDraft(draftPayload));

      // Assert draft fields restored
      expect(newState.name).toBe('Restored Name');
      expect(newState.ageYears).toBe(6);
      expect(newState.step).toBe('avatar');

      // Assert permissions NOT overwritten
      expect(newState.lastKnown).toEqual({
        location: 'granted',
        camera: 'denied',
      });
      
      // Assert status and error reset
      expect(newState.status).toBe('idle');
      expect(newState.error).toBeNull();
    });
  });
});
