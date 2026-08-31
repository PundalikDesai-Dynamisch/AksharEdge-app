import type { SchoolingLevel } from '@/types/models';

import { buildMissionPlan, missionCount, resolveAgeBand } from './assessmentPolicy';

describe('resolveAgeBand', () => {
  it.each([
    [5, 'preK'],
    [6, 'primary'],
  ] as const)('places age %i below the early boundary in "early"', (ageYears, schooling) => {
    expect(resolveAgeBand({ ageYears, schooling })).toBe('early');
  });

  it.each([
    [8, 'primary'],
    [9, 'middle'],
  ] as const)('places age %i between the boundaries in "middle"', (ageYears, schooling) => {
    expect(resolveAgeBand({ ageYears, schooling })).toBe('middle');
  });

  it.each([
    [11, 'middle'],
    [14, 'primary'],
  ] as const)('places age %i above the upper boundary in "upper"', (ageYears, schooling) => {
    expect(resolveAgeBand({ ageYears, schooling })).toBe('upper');
  });

  describe('at a boundary age, schooling decides', () => {
    it('puts a 7-year-old in Pre-K in "early"', () => {
      expect(resolveAgeBand({ ageYears: 7, schooling: 'preK' })).toBe('early');
    });

    it('puts a 7-year-old in Primary in "middle"', () => {
      expect(resolveAgeBand({ ageYears: 7, schooling: 'primary' })).toBe('middle');
    });

    it('puts a 10-year-old in Middle school in "upper"', () => {
      expect(resolveAgeBand({ ageYears: 10, schooling: 'middle' })).toBe('upper');
    });

    it('puts a 10-year-old still in Primary in "middle"', () => {
      expect(resolveAgeBand({ ageYears: 10, schooling: 'primary' })).toBe('middle');
    });
  });

  it('covers the whole 5-14 range design.md targets', () => {
    const levels: SchoolingLevel[] = ['preK', 'primary', 'middle'];
    for (let ageYears = 5; ageYears <= 14; ageYears += 1) {
      for (const schooling of levels) {
        expect(['early', 'middle', 'upper']).toContain(resolveAgeBand({ ageYears, schooling }));
      }
    }
  });
});

describe('buildMissionPlan', () => {
  it('numbers missions from 1, in order, with no gaps', () => {
    const plan = buildMissionPlan({ ageYears: 8, schooling: 'primary' });

    expect(plan.length).toBeGreaterThan(0);
    expect(plan.map(m => m.order)).toEqual(plan.map((_, i) => i + 1));
  });

  it('never returns an empty plan for any child in range', () => {
    for (let ageYears = 5; ageYears <= 14; ageYears += 1) {
      expect(buildMissionPlan({ ageYears, schooling: 'primary' })).not.toHaveLength(0);
    }
  });

  it('is deterministic -- the same child always gets the same sequence', () => {
    const input = { ageYears: 9, schooling: 'primary' } as const;
    expect(buildMissionPlan(input)).toEqual(buildMissionPlan(input));
  });

  it('agrees with missionCount', () => {
    const input = { ageYears: 12, schooling: 'middle' } as const;
    expect(buildMissionPlan(input)).toHaveLength(missionCount(input));
  });
});
