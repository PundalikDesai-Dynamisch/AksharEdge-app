import type { Assessment } from '@/domain/entities/Assessment';

import {
  isAssessmentComplete,
  isPlayAvailable,
  isReportAvailable,
} from './reportAvailability';

function assessment(overrides: Partial<Assessment> = {}): Assessment {
  return {
    assessmentId: 'a1',
    childId: 'c1',
    parentId: 'p1',
    ageBand: 'middle',
    missionPlan: [
      { gameId: 'g1', order: 1 },
      { gameId: 'g2', order: 2 },
    ],
    status: 'in_progress',
    completedGameIds: [],
    writingStatus: 'pending',
    startedAt: '2026-01-01T00:00:00.000Z',
    submittedAt: null,
    appVersion: '1.0.0',
    unityBuildId: null,
    ...overrides,
  };
}

describe('isAssessmentComplete', () => {
  it('is false when no assessment exists', () => {
    expect(isAssessmentComplete(null)).toBe(false);
  });

  it('is false when games remain unplayed', () => {
    expect(
      isAssessmentComplete(assessment({ completedGameIds: ['g1'], writingStatus: 'uploaded' })),
    ).toBe(false);
  });

  it('is false when every game is played but the writing sample is not uploaded', () => {
    expect(
      isAssessmentComplete(assessment({ completedGameIds: ['g1', 'g2'] })),
    ).toBe(false);
  });

  it('is false when the writing upload failed', () => {
    expect(
      isAssessmentComplete(
        assessment({ completedGameIds: ['g1', 'g2'], writingStatus: 'failed' }),
      ),
    ).toBe(false);
  });

  it('is true only when every game is played and the writing is uploaded', () => {
    expect(
      isAssessmentComplete(
        assessment({ completedGameIds: ['g1', 'g2'], writingStatus: 'uploaded' }),
      ),
    ).toBe(true);
  });

  it('ignores completed games that are not in the mission plan', () => {
    expect(
      isAssessmentComplete(
        assessment({ completedGameIds: ['g1', 'g9'], writingStatus: 'uploaded' }),
      ),
    ).toBe(false);
  });
});

describe('isReportAvailable', () => {
  const finished = { completedGameIds: ['g1', 'g2'], writingStatus: 'uploaded' } as const;

  it('is false while the assessment is incomplete, even if marked scored', () => {
    expect(isReportAvailable(assessment({ status: 'scored' }))).toBe(false);
  });

  it('is false when complete but not yet scored -- an enabled tab would open an empty screen', () => {
    expect(isReportAvailable(assessment({ ...finished, status: 'submitted' }))).toBe(false);
  });

  it('is false when scoring failed', () => {
    expect(isReportAvailable(assessment({ ...finished, status: 'failed' }))).toBe(false);
  });

  it('is true only when complete and scored', () => {
    expect(isReportAvailable(assessment({ ...finished, status: 'scored' }))).toBe(true);
  });
});

describe('Play and Report are mutually exclusive', () => {
  it('offers Play and withholds Report before completion', () => {
    const a = assessment();
    expect(isPlayAvailable(a)).toBe(true);
    expect(isReportAvailable(a)).toBe(false);
  });

  it('withholds Play once the assessment is complete', () => {
    const a = assessment({
      completedGameIds: ['g1', 'g2'],
      writingStatus: 'uploaded',
      status: 'scored',
    });
    expect(isPlayAvailable(a)).toBe(false);
    expect(isReportAvailable(a)).toBe(true);
  });

  it('offers Play when there is no assessment at all', () => {
    expect(isPlayAvailable(null)).toBe(true);
  });
});
