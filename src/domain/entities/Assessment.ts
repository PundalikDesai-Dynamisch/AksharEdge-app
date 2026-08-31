import type { AgeBand, AssessmentStatus, WritingStatus } from '@/types/models';

/** One game round in the sequence a child will play. */
export interface MissionPlanEntry {
  readonly gameId: string;
  readonly order: number;
}

/**
 * One screening run for one child.
 *
 * `missionPlan` is frozen when the assessment is created rather than recomputed on each render,
 * so a child who starts a run keeps the same sequence even if the policy changes underneath
 * them — and so a completed run stays interpretable later.
 */
export interface Assessment {
  readonly assessmentId: string;
  readonly childId: string;
  readonly parentId: string;
  readonly ageBand: AgeBand;
  readonly missionPlan: readonly MissionPlanEntry[];
  readonly status: AssessmentStatus;
  readonly completedGameIds: readonly string[];
  readonly writingStatus: WritingStatus;
  readonly startedAt: string;
  readonly submittedAt: string | null;
  readonly appVersion: string;
  /** Identifies which Unity build produced the results, for reproducibility. */
  readonly unityBuildId: string | null;
}
