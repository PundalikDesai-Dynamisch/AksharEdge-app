import type { AuthProvider, ContactMethod } from '@/types/models';

/** Resolved from the device or entered at sign-up; the child's own location is separate. */
export interface GeoPoint {
  readonly label: string;
  readonly lat: number;
  readonly lng: number;
}

/**
 * The account holder.
 *
 * `childCount` is denormalised deliberately: sign-in has to route to the empty state or the
 * populated list, and that decision should cost one document read rather than a query.
 */
export interface Parent {
  readonly parentId: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly contactMethod: ContactMethod;
  readonly location: GeoPoint | null;
  readonly authProvider: AuthProvider;
  readonly childCount: number;
  /** ISO 8601. Mappers convert at the data-layer boundary so Redux stays serializable. */
  readonly createdAt: string;
  readonly updatedAt: string;
}
