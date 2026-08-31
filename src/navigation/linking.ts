import type { LinkingOptions } from '@react-navigation/native';

import { APP_SCHEME } from '@/constants/config';

import type { RootStackParamList } from './types';

/**
 * Custom scheme only — Universal/App Links are out of MVP scope.
 *
 * The teacher-era deep links (`uploads`, `settings`, `student/:studentId`) pointed at screens
 * that no longer exist and have been removed with them. Phase 2 adds the parent routes and
 * Phase 4 the per-child ones, at which point a link arriving while signed out will need holding
 * until `authStatus` becomes `signedIn`.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [APP_SCHEME],
  config: {
    screens: {},
  },
};
