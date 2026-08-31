import type { MetricUnit } from '@/types/models';

/**
 * A self-describing metric rather than a fixed per-game interface.
 *
 * The report renders `label`/`value`/`unit` generically, so adding a game — or a metric to an
 * existing game — needs no React Native change and no data migration.
 */
export interface GameMetric {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly unit: MetricUnit;
}

/**
 * One completed (or abandoned) game round, as it arrives from Unity and is stored.
 *
 * `sessionId` is minted on the React Native side and echoed back by Unity, so a late message
 * from an aborted round can be discarded rather than written against the wrong assessment.
 */
export interface GameResult {
  readonly gameId: string;
  readonly sessionId: string;
  readonly assessmentId: string;
  readonly attempt: number;
  readonly startedAt: string;
  readonly endedAt: string;
  readonly durationMs: number;
  /** Bumped when the payload shape changes, so old rows stay readable. */
  readonly schemaVersion: number;
  readonly completed: boolean;
  readonly metrics: readonly GameMetric[];
  /** The Unity payload stored verbatim, never parsed by the UI — kept for later re-scoring. */
  readonly raw: Readonly<Record<string, number | string | boolean>>;
  readonly source: 'unity';
}
