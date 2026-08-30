import type { LinkingOptions } from '@react-navigation/native';

import { APP_SCHEME } from '@/constants/config';

import type { RootStackParamList } from './types';

/**
 * Custom scheme only — Universal/App Links are out of MVP scope (doc 06 §7).
 *
 * A link arriving while signed out lands on the auth stack; the pending URL is held in
 * `ui.slice.pendingDeepLink` and re-applied once `authStatus` becomes `signedIn` (doc 06 §7).
 * That consumption side arrives with ui.slice in Phase 2.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [APP_SCHEME],
  config: {
    screens: {
      App: {
        screens: {
          MainTabs: {
            screens: {
              HistoryTab: 'uploads',
              SettingsTab: 'settings',
            },
          },
          StudentDetail: 'student/:studentId',
        },
      },
    },
  },
};
