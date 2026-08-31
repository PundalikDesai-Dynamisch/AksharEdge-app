import type { MissionPlanEntry } from '@/domain/entities/Assessment';
import type { AgeBand, SchoolingLevel } from '@/types/models';

/**
 * ⚠️ OPEN PRODUCT QUESTION: is the mission plan driven by age, by schooling, or by both?
 * A 5-year-old in Primary and an 8-year-old in Pre-K disagree, and nothing in CLAUDE.md,
 * design.md, or AKSHAREDGE_SCREENS_SPEC.md settles it.
 *
 * `resolveAgeBand` takes BOTH and decides internally, so answering the question changes one
 * function rather than every call site. It currently prefers age, treating schooling as a
 * tie-breaker only where age sits on a boundary.
 */

const EARLY_MAX_AGE = 7;
const MIDDLE_MAX_AGE = 10;

/**
 * ⚠️ INTERIM: the real assessment games do not exist yet, and the Unity source project needed
 * to build them has not been located. Every band currently maps to the single embedded 2D
 * runner so the pipeline is exercisable end to end. Replace per band once real games land.
 */
const INTERIM_GAME_ID = 'simpleMobile';

const GAME_CATALOGUE: Readonly<Record<AgeBand, readonly string[]>> = {
  early: [INTERIM_GAME_ID],
  middle: [INTERIM_GAME_ID],
  upper: [INTERIM_GAME_ID],
};

const SCHOOLING_BAND: Readonly<Record<SchoolingLevel, AgeBand>> = {
  preK: 'early',
  primary: 'middle',
  middle: 'upper',
};

export interface AgeBandInput {
  readonly ageYears: number;
  readonly schooling: SchoolingLevel;
}

export function resolveAgeBand({ ageYears, schooling }: AgeBandInput): AgeBand {
  // A child at the exact boundary is placed by schooling, which is the better signal there:
  // "7 and in Primary" and "7 and in Pre-K" are meaningfully different starting points.
  if (ageYears === EARLY_MAX_AGE || ageYears === MIDDLE_MAX_AGE) {
    return SCHOOLING_BAND[schooling];
  }

  if (ageYears < EARLY_MAX_AGE) {
    return 'early';
  }

  return ageYears < MIDDLE_MAX_AGE ? 'middle' : 'upper';
}

/**
 * The ordered game sequence for a child. Frozen onto the assessment at creation — never
 * recomputed mid-run, so a policy change cannot alter a screening already in progress.
 */
export function buildMissionPlan(input: AgeBandInput): MissionPlanEntry[] {
  const band = resolveAgeBand(input);
  const games = GAME_CATALOGUE[band];

  return games.map((gameId, index) => ({ gameId, order: index + 1 }));
}

export function missionCount(input: AgeBandInput): number {
  return GAME_CATALOGUE[resolveAgeBand(input)].length;
}
