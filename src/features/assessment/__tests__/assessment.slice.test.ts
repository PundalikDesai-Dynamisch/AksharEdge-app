import type { Assessment } from '@/domain/entities/Assessment';
import { assessmentReducer, assessmentUpdated, assessmentError, setAssessmentChildId } from '../assessment.slice';

jest.mock('@features/auth/auth.thunks', () => ({
  signOutThunk: {
    fulfilled: { type: 'auth/signOut/fulfilled' },
  },
}));

describe('assessment slice', () => {
  const initialState = {
    childId: null,
    assessment: null,
    loading: false,
    error: null,
    currentMissionIndex: 0,
  };

  it('should return the initial state', () => {
    expect(assessmentReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setAssessmentChildId', () => {
    const actual = assessmentReducer(initialState, setAssessmentChildId('child-123'));
    expect(actual.childId).toEqual('child-123');
    expect(actual.loading).toEqual(true);
    expect(actual.error).toBeNull();
  });

  it('should handle assessmentUpdated', () => {
    const mockAssessment: Assessment = {
      assessmentId: 'a1',
      childId: 'child-123',
      parentId: 'p1',
      ageBand: 'early',
      missionPlan: [],
      status: 'in_progress',
      completedGameIds: [],
      writingStatus: 'pending',
      startedAt: '2026-09-02T00:00:00.000Z',
      submittedAt: null,
      appVersion: '0.0.1',
      unityBuildId: null,
    };

    const actual = assessmentReducer(
      initialState,
      assessmentUpdated({ childId: 'child-123', assessment: mockAssessment })
    );

    expect(actual.childId).toEqual('child-123');
    expect(actual.assessment).toEqual(mockAssessment);
    expect(actual.loading).toEqual(false);
    expect(actual.error).toBeNull();
  });

  it('should handle assessmentError', () => {
    const actual = assessmentReducer(initialState, assessmentError('Something went wrong'));
    expect(actual.error).toEqual('Something went wrong');
    expect(actual.loading).toEqual(false);
  });

  it('should handle signOutThunk.fulfilled to clear state', () => {
    const populatedState = {
      childId: 'child-123',
      assessment: { assessmentId: 'a1' } as Assessment,
      loading: false,
      error: 'Some error',
      currentMissionIndex: 2,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = assessmentReducer(populatedState, { type: 'auth/signOut/fulfilled' } as any);
    expect(actual).toEqual(initialState);
  });
});
