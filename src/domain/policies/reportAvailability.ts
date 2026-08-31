import type { Assessment } from '@/domain/entities/Assessment';

/**
 * The single predicate deciding whether the Report tab unlocks, and its counterpart for Play.
 *
 * CLAUDE.md §11 and design.md §13 make these mutually exclusive: before completion Play is
 * active and Report is disabled; after completion Report is active and Play is disabled. Keeping
 * both here means the two tabs can never disagree, and neither is ever driven by a local flag.
 */

/** Every game played AND the writing sample uploaded. Either alone is not completion. */
export function isAssessmentComplete(assessment: Assessment | null): boolean {
  if (assessment === null) {
    return false;
  }

  const allGamesPlayed = assessment.missionPlan.every(mission =>
    assessment.completedGameIds.includes(mission.gameId),
  );

  return allGamesPlayed && assessment.writingStatus === 'uploaded';
}

/**
 * Completion alone does not unlock the report — the backend has to have scored it. Showing an
 * enabled Report tab that opens an empty screen is worse than showing it disabled.
 */
export function isReportAvailable(assessment: Assessment | null): boolean {
  if (assessment === null) {
    return false;
  }

  return isAssessmentComplete(assessment) && assessment.status === 'scored';
}

export function isPlayAvailable(assessment: Assessment | null): boolean {
  return !isAssessmentComplete(assessment);
}
