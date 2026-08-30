import type { AuthProvider } from '@/types/models';

/**
 * The signed-in teacher — the app's only authenticated user (doc 01 §2).
 *
 * Timestamps are ISO strings, not Firestore `Timestamp` objects: mappers convert them at the
 * data-layer boundary so nothing non-serializable ever reaches Redux (doc 16 §2, doc 09 §9).
 */
export interface Teacher {
  /** Firebase Auth uid, and the `teachers/{teacherId}` document id. */
  teacherId: string;
  fullName: string;
  /** Always lowercased. */
  email: string;
  school: string;
  phone: string | null;
  photoUrl: string | null;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}
