import { doc, getDoc, getFirestore, setDoc, updateDoc } from '@react-native-firebase/firestore';

import { AppError } from '@/domain/errors/AppError';

import type { Parent } from '@/domain/entities/Parent';
import type {
  CreateParentInput,
  ParentRepository,
  UpdateParentInput,
} from '@data/repositories/parentRepository';

import { COLLECTIONS } from './collections';
import { mapDataError } from './errorMap';
import { toParent } from './mappers/entityMappers';
import { nowIso } from './mappers/timestamps';

export const firebaseParentRepository: ParentRepository = {
  async fetchOrCreate(input: CreateParentInput): Promise<Parent> {
    try {
      const ref = doc(getFirestore(), COLLECTIONS.parents, input.parentId);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        return toParent(input.parentId, snapshot.data() ?? {});
      }

      const timestamp = nowIso();
      const parent: Parent = {
        parentId: input.parentId,
        fullName: input.fullName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        contactMethod: input.contactMethod,
        location: input.location,
        authProvider: input.authProvider,
        // A parent always starts with no children; the wizard is the only thing that adds any.
        childCount: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await setDoc(ref, parent);
      return parent;
    } catch (error) {
      throw mapDataError(error, "We couldn't load your account. Please try again.");
    }
  },

  async get(parentId: string): Promise<Parent> {
    try {
      const snapshot = await getDoc(doc(getFirestore(), COLLECTIONS.parents, parentId));

      if (!snapshot.exists()) {
        throw new AppError('FIRESTORE_FAILED', "We couldn't find your account.", null, false);
      }

      return toParent(parentId, snapshot.data() ?? {});
    } catch (error) {
      throw mapDataError(error, "We couldn't load your account. Please try again.");
    }
  },

  async update(parentId: string, patch: UpdateParentInput): Promise<void> {
    try {
      await updateDoc(doc(getFirestore(), COLLECTIONS.parents, parentId), {
        ...patch,
        updatedAt: nowIso(),
      });
    } catch (error) {
      throw mapDataError(error, "We couldn't save your changes. Please try again.");
    }
  },
};
