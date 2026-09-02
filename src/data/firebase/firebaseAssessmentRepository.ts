import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';

import { AppError } from '@/domain/errors/AppError';

import type { Assessment } from '@/domain/entities/Assessment';
import type { GameResult } from '@/domain/entities/GameResult';
import type { WritingSample } from '@/domain/entities/WritingSample';
import type {
  AssessmentRepository,
  CreateAssessmentInput,
  SaveGameResultInput,
  SaveWritingSampleInput,
} from '@data/repositories/assessmentRepository';
import type { ErrorObserver, Observer, Unsubscribe } from '@data/repositories/types';

import { COLLECTIONS, SUBCOLLECTIONS } from './collections';
import { mapDataError } from './errorMap';
import { toAssessment, toGameResult, toWritingSample } from './mappers/entityMappers';
import { nowIso } from './mappers/timestamps';

export const firebaseAssessmentRepository: AssessmentRepository = {
  observeLatestForChild(
    childId: string,
    parentId: string,
    onChange: Observer<Assessment | null>,
    onError: ErrorObserver,
  ): Unsubscribe {
    const q = query(
      collection(getFirestore(), COLLECTIONS.assessments),
      where('childId', '==', childId),
      where('parentId', '==', parentId),
      orderBy('startedAt', 'desc'),
      limit(1),
    );

    return onSnapshot(
      q,
      snapshot => {
        const first = snapshot.docs[0];
        // null rather than a throw: "this child has never been assessed" is a normal state
        // that Ready to Play renders, not an error.
        onChange(first === undefined ? null : toAssessment(first.id, first.data() ?? {}));
      },
      error => onError(mapDataError(error, "We couldn't load this assessment.")),
    );
  },

  async get(assessmentId: string): Promise<Assessment> {
    try {
      const snapshot = await getDoc(doc(getFirestore(), COLLECTIONS.assessments, assessmentId));

      if (!snapshot.exists()) {
        throw new AppError('ASSESSMENT_NOT_FOUND', "We couldn't find that assessment.", null, false);
      }

      return toAssessment(assessmentId, snapshot.data() ?? {});
    } catch (error) {
      throw mapDataError(error, "We couldn't load that assessment. Please try again.");
    }
  },

  async create(input: CreateAssessmentInput): Promise<Assessment> {
    try {
      const payload = {
        ...input,
        // The plan is frozen here so a policy change can never alter a run in progress.
        missionPlan: [...input.missionPlan],
        status: 'in_progress' as const,
        completedGameIds: [] as string[],
        writingStatus: 'pending' as const,
        startedAt: nowIso(),
        submittedAt: null,
      };

      const ref = await addDoc(collection(getFirestore(), COLLECTIONS.assessments), payload);
      return toAssessment(ref.id, payload);
    } catch (error) {
      throw mapDataError(error, "We couldn't start the assessment. Please try again.");
    }
  },

  async saveGameResult(input: SaveGameResultInput): Promise<void> {
    try {
      const db = getFirestore();
      // Document id is the gameId, so replaying a round overwrites rather than duplicating.
      const resultRef = doc(
        db,
        COLLECTIONS.assessments,
        input.assessmentId,
        SUBCOLLECTIONS.gameResults,
        input.gameId,
      );

      await setDoc(resultRef, { ...input, source: 'unity' });

      const assessmentRef = doc(db, COLLECTIONS.assessments, input.assessmentId);
      const snapshot = await getDoc(assessmentRef);
      const completed = toAssessment(input.assessmentId, snapshot.data() ?? {}).completedGameIds;

      // Read-then-write rather than arrayUnion: the security rules only accept a whole
      // completedGameIds array, and this keeps the value derived from what was actually stored.
      if (!completed.includes(input.gameId)) {
        await updateDoc(assessmentRef, { completedGameIds: [...completed, input.gameId] });
      }
    } catch (error) {
      throw mapDataError(error, "We couldn't save that game. Please try again.");
    }
  },

  async listGameResults(assessmentId: string): Promise<GameResult[]> {
    try {
      const snapshot = await getDocs(
        collection(
          getFirestore(),
          COLLECTIONS.assessments,
          assessmentId,
          SUBCOLLECTIONS.gameResults,
        ),
      );

      return snapshot.docs.map(d => toGameResult(d.id, d.data() ?? {}));
    } catch (error) {
      throw mapDataError(error, "We couldn't load the game results.");
    }
  },

  async saveWritingSample(input: SaveWritingSampleInput): Promise<WritingSample> {
    try {
      const db = getFirestore();
      const payload = {
        ...input,
        capturedAt: nowIso(),
        status: input.downloadUrl === null ? ('failed' as const) : ('uploaded' as const),
      };

      const ref = await addDoc(
        collection(db, COLLECTIONS.assessments, input.assessmentId, SUBCOLLECTIONS.writing),
        payload,
      );

      await updateDoc(doc(db, COLLECTIONS.assessments, input.assessmentId), {
        writingStatus: payload.status,
      });

      return toWritingSample(ref.id, payload);
    } catch (error) {
      throw mapDataError(error, "We couldn't save the writing sample. Please try again.");
    }
  },

  async markSubmitted(assessmentId: string): Promise<void> {
    try {
      await updateDoc(doc(getFirestore(), COLLECTIONS.assessments, assessmentId), {
        status: 'submitted',
        submittedAt: nowIso(),
      });
    } catch (error) {
      throw mapDataError(error, "We couldn't submit the assessment. Please try again.");
    }
  },
};
