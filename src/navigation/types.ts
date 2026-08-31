import type { NavigatorScreenParams } from '@react-navigation/native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Every param list in the app lives in this file. Params must stay serializable so state
 * persistence and deep links work — pass an entity's id, never the entity.
 *
 * This is the transitional shape left after the teacher-era screens were removed. Phase 2 adds
 * the parent stack (Parent Home, All Children, Parent Details, Support), Phase 3 the child
 * wizard, and Phase 4 the per-child tab navigator and assessment stack.
 */

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: { email?: string } | undefined;
  Register: undefined;
  ForgotPassword: { email?: string } | undefined;
};

export type MainTabsParamList = {
  HomeTab: undefined;
  GamesTab: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  UnityGame: { gameId: string };
};

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>;
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

/** Makes `useNavigation()` typed with no explicit generics. */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}
