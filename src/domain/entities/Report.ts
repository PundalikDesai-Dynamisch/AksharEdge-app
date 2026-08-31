import type { MetricBand, ReportStatus, WritingStatus } from '@/types/models';

export interface ReportMetric {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly max: number;
  /** Drives a visual band, so status is never communicated by colour alone. design.md §18. */
  readonly band: MetricBand;
}

export interface ReportSection {
  readonly gameId: string;
  readonly title: string;
  readonly metrics: readonly ReportMetric[];
  readonly note: string;
}

export interface ReportSummary {
  readonly status: ReportStatus;
  readonly headline: string;
  readonly body: string;
}

export interface ReportWriting {
  readonly status: WritingStatus;
  readonly note: string;
  readonly thumbnailUrl: string | null;
}

export interface ReportNextStep {
  readonly title: string;
  readonly body: string;
}

/**
 * The parent-facing result, one per assessment.
 *
 * Written only by the backend, never by the client — the security rules make `reports`
 * client-read-only so a compromised app can never fabricate a screening result.
 */
export interface Report {
  readonly reportId: string;
  readonly assessmentId: string;
  readonly childId: string;
  readonly parentId: string;
  readonly generatedAt: string;
  readonly schemaVersion: number;
  readonly summary: ReportSummary;
  readonly sections: readonly ReportSection[];
  readonly writing: ReportWriting;
  readonly nextSteps: readonly ReportNextStep[];
}
