/**
 * Security-rules tests for firestore.rules, run against the Firestore emulator.
 *
 * The negative cases matter more than the positive ones. A rule that is too permissive still
 * makes the app work, so the only thing that catches it is a test that asserts a specific
 * operation is *denied* — which is why every `assertFails` below is spelled out rather than
 * folded into a loop.
 *
 * Not part of `yarn test`. See jest.rules.config.js.
 */
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  setLogLevel,
  updateDoc,
  where,
} from 'firebase/firestore';

import type { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import type { Firestore } from 'firebase/firestore';

import type { Assessment } from '@/domain/entities/Assessment';
import type { Child } from '@/domain/entities/Child';
import type { Parent } from '@/domain/entities/Parent';
import type { Report } from '@/domain/entities/Report';

import { initFirestoreRulesEnv } from './jest/rulesEmulator';

const ALICE = 'parent-alice';
const BOB = 'parent-bob';

const ALICE_CHILD = 'child-of-alice';
const BOB_CHILD = 'child-of-bob';
const ALICE_ASSESSMENT = 'assessment-of-alice';
const BOB_ASSESSMENT = 'assessment-of-bob';

let testEnv: RulesTestEnvironment;

/**
 * The signed-in Firestore handle for a given parent uid.
 *
 * The cast bridges a typing quirk rather than a real incompatibility: `RulesTestContext.firestore()`
 * is declared as the *compat* `firebase.firestore.Firestore`, while the modular `doc()`/`getDoc()`
 * used below want the modular `Firestore`. The two declarations differ (the modular one carries
 * `type` and `toJSON`), but the object handed back is deliberately usable with either API — the
 * library's own doc comment says so, and the assertions in this file exercise it at runtime.
 */
function asParent(uid: string): Firestore {
  return testEnv.authenticatedContext(uid).firestore() as unknown as Firestore;
}

function asAnonymous(): Firestore {
  return testEnv.unauthenticatedContext().firestore() as unknown as Firestore;
}

/**
 * Fixtures are typed against the real domain entities, with the id field dropped because it is
 * the document id rather than a stored field.
 *
 * This is not decoration. A rule that tests `resource.data.parentId` only means something if
 * `parentId` is genuinely the field name, so the fixtures have to be schema-true — and the
 * compiler is the only thing that will keep them that way. It has already rejected an
 * `avatarId` and an `ageBand` invented here by hand.
 */
function parentDoc(parentId: string, fullName: string): Parent {
  return {
    parentId,
    fullName,
    email: `${parentId}@example.test`,
    phone: null,
    contactMethod: 'email',
    location: null,
    authProvider: 'password',
    childCount: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

function childDoc(parentId: string): Omit<Child, 'childId'> {
  return {
    parentId,
    name: 'Ada',
    avatarId: 'avatar-01',
    ageYears: 7,
    schooling: 'primary',
    gender: 'female',
    location: null,
    status: 'not_started',
    latestAssessmentId: null,
    isDeleted: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

function assessmentDoc(parentId: string, childId: string): Omit<Assessment, 'assessmentId'> {
  return {
    childId,
    parentId,
    ageBand: 'middle',
    missionPlan: [{ gameId: 'letter-match', order: 1 }],
    status: 'in_progress',
    completedGameIds: [],
    writingStatus: 'pending',
    startedAt: '2026-01-02T00:00:00.000Z',
    submittedAt: null,
    appVersion: '0.0.1',
    unityBuildId: null,
  };
}

/** The report id IS the assessment id — see firebaseReportRepository.getByAssessment. */
function reportDoc(parentId: string, childId: string, assessmentId: string): Report {
  return {
    reportId: assessmentId,
    assessmentId,
    childId,
    parentId,
    generatedAt: '2026-01-03T00:00:00.000Z',
    schemaVersion: 1,
    summary: { status: 'on_track', headline: 'Ada is on track', body: '' },
    sections: [],
    writing: { status: 'uploaded', note: '', thumbnailUrl: null },
    nextSteps: [],
  };
}

/** Seeded with admin privileges — this is fixture setup, not a thing under test. */
async function seed(): Promise<void> {
  await testEnv.withSecurityRulesDisabled(async context => {
    const db = context.firestore() as unknown as Firestore;

    await setDoc(doc(db, 'parents', ALICE), parentDoc(ALICE, 'Alice'));
    await setDoc(doc(db, 'parents', BOB), parentDoc(BOB, 'Bob'));

    await setDoc(doc(db, 'children', ALICE_CHILD), childDoc(ALICE));
    await setDoc(doc(db, 'children', BOB_CHILD), childDoc(BOB));

    await setDoc(doc(db, 'assessments', ALICE_ASSESSMENT), assessmentDoc(ALICE, ALICE_CHILD));
    await setDoc(doc(db, 'assessments', BOB_ASSESSMENT), assessmentDoc(BOB, BOB_CHILD));

    await setDoc(
      doc(db, 'reports', ALICE_ASSESSMENT),
      reportDoc(ALICE, ALICE_CHILD, ALICE_ASSESSMENT),
    );
  });
}

beforeAll(async () => {
  // Every negative test here produces an expected PERMISSION_DENIED, and the Firestore SDK logs
  // each one as a warning with a full stack trace. At the default level the suite's own result is
  // buried under ~30 of them, which is exactly when a real failure stops being noticeable.
  setLogLevel('error');
  testEnv = await initFirestoreRulesEnv();
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await seed();
});

describe('parents/{parentId}', () => {
  it('lets a parent read their own document', async () => {
    await assertSucceeds(getDoc(doc(asParent(ALICE), 'parents', ALICE)));
  });

  it('lets a parent update their own document', async () => {
    await assertSucceeds(
      updateDoc(doc(asParent(ALICE), 'parents', ALICE), { fullName: 'Alice Cooper' }),
    );
  });

  it('lets a parent create their own document when parentId matches the doc id', async () => {
    await testEnv.clearFirestore();
    await assertSucceeds(
      setDoc(doc(asParent(ALICE), 'parents', ALICE), parentDoc(ALICE, 'Alice')),
    );
  });

  it('rejects a create whose parentId does not match the doc id', async () => {
    await testEnv.clearFirestore();
    await assertFails(
      setDoc(doc(asParent(ALICE), 'parents', ALICE), { ...parentDoc(ALICE, 'Alice'), parentId: BOB }),
    );
  });

  it("rejects reading another parent's document", async () => {
    await assertFails(getDoc(doc(asParent(ALICE), 'parents', BOB)));
  });

  it('rejects deleting the account document', async () => {
    await assertFails(deleteDoc(doc(asParent(ALICE), 'parents', ALICE)));
  });

  it('rejects an unauthenticated read', async () => {
    await assertFails(getDoc(doc(asAnonymous(), 'parents', ALICE)));
  });
});

describe('children/{childId}', () => {
  it('lets a parent read their own child', async () => {
    await assertSucceeds(getDoc(doc(asParent(ALICE), 'children', ALICE_CHILD)));
  });

  it("rejects reading another parent's child", async () => {
    await assertFails(getDoc(doc(asParent(ALICE), 'children', BOB_CHILD)));
  });

  it('allows the live children query the app actually runs', async () => {
    // Mirrors firebaseChildRepository.observeByParent, so this covers the rule under a list
    // operation as well as the composite index shape.
    await assertSucceeds(
      getDocs(
        query(
          collection(asParent(ALICE), 'children'),
          where('parentId', '==', ALICE),
          where('isDeleted', '==', false),
          orderBy('createdAt', 'desc'),
        ),
      ),
    );
  });

  it("rejects a children query scoped to another parent", async () => {
    await assertFails(
      getDocs(query(collection(asParent(ALICE), 'children'), where('parentId', '==', BOB))),
    );
  });

  it('lets a parent create a child they own', async () => {
    await assertSucceeds(
      setDoc(doc(asParent(ALICE), 'children', 'new-child'), childDoc(ALICE)),
    );
  });

  it('rejects creating a child owned by someone else', async () => {
    await assertFails(setDoc(doc(asParent(ALICE), 'children', 'new-child'), childDoc(BOB)));
  });

  it('allows a soft delete', async () => {
    await assertSucceeds(
      updateDoc(doc(asParent(ALICE), 'children', ALICE_CHILD), { isDeleted: true }),
    );
  });

  it('rejects a hard delete', async () => {
    await assertFails(deleteDoc(doc(asParent(ALICE), 'children', ALICE_CHILD)));
  });

  it('rejects reassigning the owner on update', async () => {
    await assertFails(
      updateDoc(doc(asParent(ALICE), 'children', ALICE_CHILD), { parentId: BOB }),
    );
  });

  it("rejects updating another parent's child", async () => {
    await assertFails(updateDoc(doc(asParent(ALICE), 'children', BOB_CHILD), { name: 'Taken' }));
  });
});

describe('assessments/{assessmentId}', () => {
  it('lets a parent read their own assessment', async () => {
    await assertSucceeds(getDoc(doc(asParent(ALICE), 'assessments', ALICE_ASSESSMENT)));
  });

  it("rejects reading another parent's assessment", async () => {
    await assertFails(getDoc(doc(asParent(ALICE), 'assessments', BOB_ASSESSMENT)));
  });

  it('lets a parent create an assessment they own', async () => {
    await assertSucceeds(
      setDoc(
        doc(asParent(ALICE), 'assessments', 'new-assessment'),
        assessmentDoc(ALICE, ALICE_CHILD),
      ),
    );
  });

  it('rejects creating an assessment owned by someone else', async () => {
    await assertFails(
      setDoc(
        doc(asParent(ALICE), 'assessments', 'new-assessment'),
        assessmentDoc(BOB, BOB_CHILD),
      ),
    );
  });

  it('allows the completedGameIds update saveGameResult performs', async () => {
    await assertSucceeds(
      updateDoc(doc(asParent(ALICE), 'assessments', ALICE_ASSESSMENT), {
        completedGameIds: ['letter-match'],
      }),
    );
  });

  it('allows the markSubmitted update', async () => {
    await assertSucceeds(
      updateDoc(doc(asParent(ALICE), 'assessments', ALICE_ASSESSMENT), {
        status: 'submitted',
        submittedAt: '2026-01-04T00:00:00.000Z',
      }),
    );
  });

  it('rejects a delete', async () => {
    await assertFails(deleteDoc(doc(asParent(ALICE), 'assessments', ALICE_ASSESSMENT)));
  });
});

describe('assessments/{id}/gameResults — ownership resolved via get()', () => {
  it('lets the owning parent write a game result', async () => {
    await assertSucceeds(
      setDoc(
        doc(asParent(ALICE), 'assessments', ALICE_ASSESSMENT, 'gameResults', 'letter-match'),
        { gameId: 'letter-match', assessmentId: ALICE_ASSESSMENT, source: 'unity' },
      ),
    );
  });

  it('lets the owning parent list game results', async () => {
    await assertSucceeds(
      getDocs(collection(asParent(ALICE), 'assessments', ALICE_ASSESSMENT, 'gameResults')),
    );
  });

  it("rejects writing into another parent's assessment", async () => {
    await assertFails(
      setDoc(doc(asParent(ALICE), 'assessments', BOB_ASSESSMENT, 'gameResults', 'letter-match'), {
        gameId: 'letter-match',
        assessmentId: BOB_ASSESSMENT,
        source: 'unity',
      }),
    );
  });

  it("rejects reading another parent's game results", async () => {
    await assertFails(
      getDocs(collection(asParent(ALICE), 'assessments', BOB_ASSESSMENT, 'gameResults')),
    );
  });

  it('rejects a write under an assessment that does not exist', async () => {
    await assertFails(
      setDoc(doc(asParent(ALICE), 'assessments', 'no-such-assessment', 'gameResults', 'g'), {
        gameId: 'g',
      }),
    );
  });
});

describe('assessments/{id}/writing — ownership resolved via get()', () => {
  it('lets the owning parent write a writing sample', async () => {
    await assertSucceeds(
      setDoc(doc(asParent(ALICE), 'assessments', ALICE_ASSESSMENT, 'writing', 'sample-1'), {
        assessmentId: ALICE_ASSESSMENT,
        storagePath: 'parents/x/children/y/assessments/z/writing/a.jpg',
        status: 'uploaded',
      }),
    );
  });

  it("rejects writing into another parent's assessment", async () => {
    await assertFails(
      setDoc(doc(asParent(ALICE), 'assessments', BOB_ASSESSMENT, 'writing', 'sample-1'), {
        assessmentId: BOB_ASSESSMENT,
        status: 'uploaded',
      }),
    );
  });
});

describe('reports/{reportId} — client-read-only', () => {
  it('lets the owning parent read their report', async () => {
    await assertSucceeds(getDoc(doc(asParent(ALICE), 'reports', ALICE_ASSESSMENT)));
  });

  it("rejects reading another parent's report", async () => {
    await assertFails(getDoc(doc(asParent(BOB), 'reports', ALICE_ASSESSMENT)));
  });

  it('rejects a client create', async () => {
    await assertFails(
      setDoc(doc(asParent(ALICE), 'reports', 'forged-report'), {
        reportId: 'forged-report',
        parentId: ALICE,
        summary: { status: 'low_risk', headline: 'All good', body: '' },
      }),
    );
  });

  it('rejects a client update, even by the owner', async () => {
    await assertFails(
      updateDoc(doc(asParent(ALICE), 'reports', ALICE_ASSESSMENT), {
        summary: { status: 'low_risk', headline: 'Rewritten', body: '' },
      }),
    );
  });

  it('rejects a client delete', async () => {
    await assertFails(deleteDoc(doc(asParent(ALICE), 'reports', ALICE_ASSESSMENT)));
  });
});

describe('unmatched collections', () => {
  it('denies a collection with no rule of its own', async () => {
    await assertFails(getDoc(doc(asParent(ALICE), 'teachers', ALICE)));
  });

  it('denies writing to a collection with no rule of its own', async () => {
    await assertFails(setDoc(doc(asParent(ALICE), 'anything', 'x'), { parentId: ALICE }));
  });
});
