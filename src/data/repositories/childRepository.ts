import type { Child } from '@/domain/entities/Child';
import type { AvatarId } from '@/types/models';

import type { Observer, ErrorObserver, Unsubscribe } from './types';

export interface CreateChildInput {
  readonly parentId: string;
  readonly name: string;
  readonly avatarId: AvatarId;
  readonly ageYears: number;
  readonly schooling: Child['schooling'];
  readonly gender: Child['gender'];
  readonly location: Child['location'];
}

export type UpdateChildInput = Partial<Omit<CreateChildInput, 'parentId'>>;

export interface ChildRepository {
  /**
   * Live list of a parent's children, excluding soft-deleted ones. Drives Parent Home's
   * empty/populated states, the status pills, and All Children from one subscription.
   */
  observeByParent(
    parentId: string,
    onChange: Observer<Child[]>,
    onError: ErrorObserver,
  ): Unsubscribe;
  get(childId: string): Promise<Child>;
  create(input: CreateChildInput): Promise<Child>;
  update(childId: string, patch: UpdateChildInput): Promise<void>;
  /** Soft delete only — the security rules forbid a hard delete. */
  softDelete(childId: string): Promise<void>;
}
