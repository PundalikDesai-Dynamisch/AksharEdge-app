import type { Report } from '@/domain/entities/Report';

export interface ReportRepository {
  /**
   * Reports are written only by the backend — the security rules make this collection
   * client-read-only, so a compromised app can never fabricate a screening result. Rejects with
   * `REPORT_NOT_READY` when scoring has not produced one yet.
   */
  getByAssessment(assessmentId: string): Promise<Report>;
}
