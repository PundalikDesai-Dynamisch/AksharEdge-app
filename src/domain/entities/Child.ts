import type { AvatarId, ChildStatus, Gender, SchoolingLevel } from '@/types/models';

import type { GeoPoint } from './Parent';

/** Captured by reverse geocoding once the location permission is granted, never typed by hand. */
export interface ChildLocation extends GeoPoint {
  readonly capturedAt: string;
}

export interface Child {
  readonly childId: string;
  readonly parentId: string;
  readonly name: string;
  /**
   * Key into the illustrated avatar set — never a photo URL. design.md §7.
   * Typed as a closed union rather than `string` so the rule is enforced by the compiler
   * instead of by this comment.
   */
  readonly avatarId: AvatarId;
  readonly ageYears: number;
  readonly schooling: SchoolingLevel;
  readonly gender: Gender;
  readonly location: ChildLocation | null;
  /** Derived from assessment state by `deriveChildStatus`; stored for cheap list rendering. */
  readonly status: ChildStatus;
  readonly latestAssessmentId: string | null;
  /** Soft delete only — the security rules forbid a hard delete. */
  readonly isDeleted: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
