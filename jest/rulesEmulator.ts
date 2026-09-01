/**
 * Shared wiring for the security-rules test suites.
 *
 * These suites do not run in Jest's React Native environment — they run in plain Node against
 * the Firebase emulators, which is why they have their own config (jest.rules.config.js) and are
 * excluded from `yarn test`. Booting an emulator on every unit-test run would be intolerable.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { initializeTestEnvironment } from '@firebase/rules-unit-testing';

import type { RulesTestEnvironment } from '@firebase/rules-unit-testing';

const ROOT = resolve(__dirname, '..');
const EMULATOR_HOST = '127.0.0.1';

/**
 * The `demo-` prefix is load-bearing, not cosmetic: the emulator suite treats a project id
 * starting with it as definitively fake, so these tests need no credentials and can never reach
 * the real `dyslexiamvp` project even if someone runs them with production gcloud auth active.
 */
export const RULES_TEST_PROJECT_ID = 'demo-aksharedge';

type EmulatorService = 'firestore' | 'storage' | 'auth';

interface FirebaseJson {
  readonly emulators?: Readonly<Record<string, { readonly port?: number } | undefined>>;
}

/**
 * Ports are read from firebase.json rather than repeated here, so the emulator the CLI starts
 * and the emulator the tests connect to cannot drift apart.
 */
function emulatorPort(service: EmulatorService): number {
  const config = JSON.parse(
    readFileSync(resolve(ROOT, 'firebase.json'), 'utf8'),
  ) as FirebaseJson;
  const port = config.emulators?.[service]?.port;

  if (port === undefined) {
    throw new Error(
      `firebase.json declares no "${service}" emulator port. Add one to the "emulators" block.`,
    );
  }

  return port;
}

/** The rules are loaded from the very files that get deployed — never a test-only copy. */
function rulesSource(fileName: string): string {
  return readFileSync(resolve(ROOT, fileName), 'utf8');
}

export function initFirestoreRulesEnv(): Promise<RulesTestEnvironment> {
  return initializeTestEnvironment({
    projectId: RULES_TEST_PROJECT_ID,
    firestore: {
      rules: rulesSource('firestore.rules'),
      host: EMULATOR_HOST,
      port: emulatorPort('firestore'),
    },
  });
}

export function initStorageRulesEnv(): Promise<RulesTestEnvironment> {
  return initializeTestEnvironment({
    projectId: RULES_TEST_PROJECT_ID,
    storage: {
      rules: rulesSource('storage.rules'),
      host: EMULATOR_HOST,
      port: emulatorPort('storage'),
    },
  });
}
