import { firebaseAssessmentRepository } from './firebase/firebaseAssessmentRepository';
import { firebaseChildRepository } from './firebase/firebaseChildRepository';
import { firebaseMediaRepository } from './firebase/firebaseMediaRepository';
import { firebaseParentRepository } from './firebase/firebaseParentRepository';
import { firebaseReportRepository } from './firebase/firebaseReportRepository';

import type {
  AssessmentRepository,
  ChildRepository,
  MediaRepository,
  ParentRepository,
  ReportRepository,
} from './repositories';

/**
 * The one place an implementation is chosen.
 *
 * Thunks receive this as RTK's `extra` argument and depend only on the interfaces, so moving
 * off Firebase means adding one folder under `src/data/` and editing this function. No screen,
 * slice, or thunk changes.
 */
export interface Repositories {
  readonly parents: ParentRepository;
  readonly children: ChildRepository;
  readonly assessments: AssessmentRepository;
  readonly reports: ReportRepository;
  readonly media: MediaRepository;
}

export function buildRepositories(): Repositories {
  return {
    parents: firebaseParentRepository,
    children: firebaseChildRepository,
    assessments: firebaseAssessmentRepository,
    reports: firebaseReportRepository,
    media: firebaseMediaRepository,
  };
}
