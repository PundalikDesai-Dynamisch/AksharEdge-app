import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';

import { AppError } from '@/domain/errors/AppError';

import type { Child } from '@/domain/entities/Child';
import type {
  ChildRepository,
  CreateChildInput,
  UpdateChildInput,
} from '@data/repositories/childRepository';
import type { ErrorObserver, Observer, Unsubscribe } from '@data/repositories/types';

import { COLLECTIONS } from './collections';
import { mapDataError } from './errorMap';
import { toChild } from './mappers/entityMappers';
import { nowIso } from './mappers/timestamps';

export const firebaseChildRepository: ChildRepository = {
  observeByParent(
    parentId: string,
    onChange: Observer<Child[]>,
    onError: ErrorObserver,
  ): Unsubscribe {
    const q = query(
      collection(getFirestore(), COLLECTIONS.children),
      where('parentId', '==', parentId),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc'),
    );

    // onSnapshot's own unsubscribe is returned directly — the interface promises a bare
    // function, so nothing above this line learns that Firestore is underneath.
    return onSnapshot(
      q,
      snapshot => onChange(snapshot.docs.map(d => toChild(d.id, d.data() ?? {}))),
      // A live query has no promise to reject, so failures arrive here instead.
      error => onError(mapDataError(error, "We couldn't load your children right now.")),
    );
  },

  async get(childId: string): Promise<Child> {
    try {
      const snapshot = await getDoc(doc(getFirestore(), COLLECTIONS.children, childId));

      if (!snapshot.exists()) {
        throw new AppError('FIRESTORE_FAILED', "We couldn't find that profile.", null, false);
      }

      return toChild(childId, snapshot.data() ?? {});
    } catch (error) {
      throw mapDataError(error, "We couldn't load that profile. Please try again.");
    }
  },

  async create(input: CreateChildInput): Promise<Child> {
    try {
      const timestamp = nowIso();
      const payload = {
        ...input,
        status: 'not_started' as const,
        latestAssessmentId: null,
        isDeleted: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const ref = await addDoc(collection(getFirestore(), COLLECTIONS.children), payload);
      return toChild(ref.id, payload);
    } catch (error) {
      throw mapDataError(error, "We couldn't create that profile. Please try again.");
    }
  },

  async update(childId: string, patch: UpdateChildInput): Promise<void> {
    try {
      await updateDoc(doc(getFirestore(), COLLECTIONS.children, childId), {
        ...patch,
        updatedAt: nowIso(),
      });
    } catch (error) {
      throw mapDataError(error, "We couldn't save those changes. Please try again.");
    }
  },

  async softDelete(childId: string): Promise<void> {
    try {
      await updateDoc(doc(getFirestore(), COLLECTIONS.children, childId), {
        isDeleted: true,
        updatedAt: nowIso(),
      });
    } catch (error) {
      throw mapDataError(error, "We couldn't remove that profile. Please try again.");
    }
  },
};
