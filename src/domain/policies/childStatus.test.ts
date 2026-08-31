import type { Assessment } from '@/domain/entities/Assessment';

import { deriveChildStatus } from './childStatus';

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

describe('deriveChildStatus', () => {
  it('is "not_started" when the child has no assessment', () => {
    expect(deriveChildStatus(null)).toBe('not_started');
  });

  it('is "not_started" when an assessment exists but nothing has been done', () => {
    expect(deriveChildStatus(assessment())).toBe('not_started');
  });

  it('is "in_progress" once a single game is played', () => {
    expect(deriveChildStatus(assessment({ completedGameIds: ['g1'] }))).toBe('in_progress');
  });

  it('is "in_progress" once writing is attempted, even with no games played', () => {
    expect(deriveChildStatus(assessment({ writingStatus: 'failed' }))).toBe('in_progress');
  });

  it('stays "in_progress" when finished but not yet scored', () => {
    expect(
      deriveChildStatus(
        assessment({
          completedGameIds: ['g1', 'g2'],
          writingStatus: 'uploaded',
          status: 'submitted',
        }),
      ),
    ).toBe('in_progress');
  });

  it('is "report_ready" only once the assessment is complete and scored', () => {
    expect(
      deriveChildStatus(
        assessment({
          completedGameIds: ['g1', 'g2'],
          writingStatus: 'uploaded',
          status: 'scored',
        }),
      ),
    ).toBe('report_ready');
  });

  it('never reports ready while a game is outstanding', () => {
    expect(
      deriveChildStatus(
        assessment({ completedGameIds: ['g1'], writingStatus: 'uploaded', status: 'scored' }),
      ),
    ).toBe('in_progress');
  });
});
