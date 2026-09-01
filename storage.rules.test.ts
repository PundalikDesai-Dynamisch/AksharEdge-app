/**
 * Security-rules tests for storage.rules, run against the Storage emulator.
 *
 * The path under test is the one `firebaseMediaRepository.buildWritingPath` builds, verbatim.
 * That is the whole point of this suite: a Storage rule that does not match the path the app
 * actually uploads to fails at runtime with `storage/unauthorized` and looks like a broken
 * camera, not a broken rule.
 *
 * Not part of `yarn test`. See jest.rules.config.js.
 */
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { deleteObject, getBytes, ref, uploadBytes } from 'firebase/storage';

import type { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import type { FirebaseStorage } from 'firebase/storage';

import { initStorageRulesEnv } from './jest/rulesEmulator';

const ALICE = 'parent-alice';
const BOB = 'parent-bob';

/** Mirrors firebaseMediaRepository.buildWritingPath. */
function writingPath(parentId: string): string {
  return `parents/${parentId}/children/child-1/assessments/assessment-1/writing/sample.jpg`;
}

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x01]);
const IMAGE_METADATA = { contentType: 'image/jpeg' };

let testEnv: RulesTestEnvironment;

function asParent(uid: string): FirebaseStorage {
  return testEnv.authenticatedContext(uid).storage();
}

function asAnonymous(): FirebaseStorage {
  return testEnv.unauthenticatedContext().storage();
}

/** Seeded with admin privileges so the read tests have something to read. */
async function seed(): Promise<void> {
  await testEnv.withSecurityRulesDisabled(async context => {
    await uploadBytes(ref(context.storage(), writingPath(ALICE)), JPEG, IMAGE_METADATA);
    await uploadBytes(ref(context.storage(), writingPath(BOB)), JPEG, IMAGE_METADATA);
  });
}

beforeAll(async () => {
  testEnv = await initStorageRulesEnv();
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearStorage();
  await seed();
});

describe('the writing-sample path', () => {
  it('lets the owning parent upload a handwriting photo', async () => {
    await assertSucceeds(
      uploadBytes(ref(asParent(ALICE), writingPath(ALICE)), JPEG, IMAGE_METADATA),
    );
  });

  it('lets the owning parent read it back', async () => {
    await assertSucceeds(getBytes(ref(asParent(ALICE), writingPath(ALICE))));
  });

  it("rejects uploading into another parent's folder", async () => {
    await assertFails(uploadBytes(ref(asParent(BOB), writingPath(ALICE)), JPEG, IMAGE_METADATA));
  });

  it("rejects reading another parent's photo", async () => {
    await assertFails(getBytes(ref(asParent(BOB), writingPath(ALICE))));
  });

  it('rejects an unauthenticated upload', async () => {
    await assertFails(uploadBytes(ref(asAnonymous(), writingPath(ALICE)), JPEG, IMAGE_METADATA));
  });

  it('rejects a PDF — a handwriting sample is a photo', async () => {
    await assertFails(
      uploadBytes(ref(asParent(ALICE), writingPath(ALICE)), JPEG, {
        contentType: 'application/pdf',
      }),
    );
  });

  it('rejects a delete, even by the owner', async () => {
    // `allow create, update` rather than `allow write` is what makes this fail — see the
    // comment in storage.rules.
    await assertFails(deleteObject(ref(asParent(ALICE), writingPath(ALICE))));
  });

  it('rejects a file over the 25 MB ceiling', async () => {
    const tooBig = new Uint8Array(25 * 1024 * 1024 + 1);
    await assertFails(
      uploadBytes(ref(asParent(ALICE), writingPath(ALICE)), tooBig, IMAGE_METADATA),
    );
  });
});

describe('everything outside the writing-sample path', () => {
  it('rejects the teacher-era path', async () => {
    await assertFails(
      uploadBytes(
        ref(asParent(ALICE), `teachers/${ALICE}/students/student-1/sample.jpg`),
        JPEG,
        IMAGE_METADATA,
      ),
    );
  });

  it('rejects a writing path missing the assessment segment', async () => {
    // The shape the roadmap originally specified. It is denied on purpose: the repository does
    // not build it, so allowing it would widen the rule for nothing.
    await assertFails(
      uploadBytes(
        ref(asParent(ALICE), `parents/${ALICE}/children/child-1/writing/sample.jpg`),
        JPEG,
        IMAGE_METADATA,
      ),
    );
  });

  it('rejects an arbitrary root object', async () => {
    await assertFails(uploadBytes(ref(asParent(ALICE), 'anything.jpg'), JPEG, IMAGE_METADATA));
  });
});
