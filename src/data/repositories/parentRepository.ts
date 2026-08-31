import type { Parent } from '@/domain/entities/Parent';

export interface CreateParentInput {
  readonly parentId: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly contactMethod: Parent['contactMethod'];
  readonly location: Parent['location'];
  readonly authProvider: Parent['authProvider'];
}

export type UpdateParentInput = Partial<
  Pick<Parent, 'fullName' | 'phone' | 'contactMethod' | 'location'>
>;

export interface ParentRepository {
  /** Reads the parent, creating the document on first sign-in. */
  fetchOrCreate(input: CreateParentInput): Promise<Parent>;
  get(parentId: string): Promise<Parent>;
  update(parentId: string, patch: UpdateParentInput): Promise<void>;
}
