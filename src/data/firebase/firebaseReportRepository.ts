import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';

import { AppError } from '@/domain/errors/AppError';

import type { Report } from '@/domain/entities/Report';
import type { ReportRepository } from '@data/repositories/reportRepository';

import { COLLECTIONS } from './collections';
import { mapDataError } from './errorMap';
import { toReport } from './mappers/entityMappers';

export const firebaseReportRepository: ReportRepository = {
  async getByAssessment(assessmentId: string): Promise<Report> {
    try {
      // The report document id IS the assessment id, so this is a direct read rather than a
      // query — one round trip, no composite index.
      const snapshot = await getDoc(doc(getFirestore(), COLLECTIONS.reports, assessmentId));

      if (!snapshot.exists()) {
        throw new AppError(
          'REPORT_NOT_READY',
          "This report isn't ready yet. We'll let you know when it is.",
          null,
          true,
        );
      }

      return toReport(assessmentId, snapshot.data() ?? {});
    } catch (error) {
      throw mapDataError(error, "We couldn't load the report. Please try again.");
    }
  },
};
