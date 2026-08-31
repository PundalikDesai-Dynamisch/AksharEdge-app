import type { Assessment } from '@/domain/entities/Assessment';
import type { ChildStatus } from '@/types/models';

import { isAssessmentComplete, isReportAvailable } from './reportAvailability';

/**
 * Derives the status pill shown on Parent Home from real assessment state.
 *
 * Kept here rather than in the card component so the pill, the tab gating, and anything the
 * report later needs all read the same rules — CLAUDE.md §10 warns specifically against
 * scattering these flags through components.
 */
export function deriveChildStatus(assessment: Assessment | null): ChildStatus {
  if (assessment === null) {
    return 'not_started';
  }

  if (isReportAvailable(assessment)) {
    return 'report_ready';
  }

  // Complete but not yet scored still reads as in progress to the parent: the work is done,
  // the result is not ready, and "report ready" would be a lie.
  if (isAssessmentComplete(assessment)) {
    return 'in_progress';
  }

  const started =
    assessment.completedGameIds.length > 0 || assessment.writingStatus !== 'pending';

  return started ? 'in_progress' : 'not_started';
}

