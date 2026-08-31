/** Every Firestore path in one place, so a rename is a single edit rather than a grep. */
export const COLLECTIONS = {
  parents: 'parents',
  children: 'children',
  assessments: 'assessments',
  reports: 'reports',
} as const;

/** Subcollections of `assessments/{assessmentId}`. */
export const SUBCOLLECTIONS = {
  gameResults: 'gameResults',
  writing: 'writing',
} as const;
