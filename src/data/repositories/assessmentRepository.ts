import type { Assessment, MissionPlanEntry } from '@/domain/entities/Assessment';
import type { GameResult } from '@/domain/entities/GameResult';
import type { WritingSample } from '@/domain/entities/WritingSample';

import type { Observer, ErrorObserver, Unsubscribe } from './types';

export interface CreateAssessmentInput {
  readonly childId: string;
  readonly parentId: string;
  readonly ageBand: Assessment['ageBand'];
  readonly missionPlan: readonly MissionPlanEntry[];
  readonly appVersion: string;
  readonly unityBuildId: string | null;
}

export type SaveGameResultInput = Omit<GameResult, 'source'>;

export interface SaveWritingSampleInput {
  readonly assessmentId: string;
  readonly storagePath: string;
  readonly downloadUrl: string | null;
  readonly promptText: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly retakeCount: number;
}

export interface AssessmentRepository {
  /** The assessment the Ready to Play screen renders from; null before the first run. */
  observeLatestForChild(
    childId: string,
    parentId: string,
    onChange: Observer<Assessment | null>,
    onError: ErrorObserver,
  ): Unsubscribe;
  get(assessmentId: string): Promise<Assessment>;
  create(input: CreateAssessmentInput): Promise<Assessment>;
  /** Keyed by gameId so a duplicate result overwrites rather than multiplying. */
  saveGameResult(input: SaveGameResultInput): Promise<void>;
  listGameResults(assessmentId: string): Promise<GameResult[]>;
  saveWritingSample(input: SaveWritingSampleInput): Promise<WritingSample>;
  markSubmitted(assessmentId: string): Promise<void>;
}
