import type { NavigatorScreenParams } from '@react-navigation/native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { CapturedFileDraft } from '@/domain/entities/CapturedFileDraft';
import type { CaptureSource, UploadStatus } from '@/types/models';

/**
 * Every param list in the app lives in this file (doc 05 §2). Params must stay serializable
 * so state persistence and deep links work — pass an entity's id, never the entity
 * (doc 06 §2). `CapturePreview.files` is the single exception and carries plain drafts only.
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
  DashboardTab: undefined;
  StudentsTab: undefined;
  HistoryTab: { initialFilter?: UploadStatus } | undefined;
  SettingsTab: undefined;
  GamesTab: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;

  /** `studentId` absent = create. */
  AddEditStudent: { studentId?: string };
  StudentDetail: { studentId: string };

  UploadOptions: { studentId: string };
  CapturePreview: {
    studentId: string;
    /** Not yet enqueued — these are still temp-URI drafts. */
    files: CapturedFileDraft[];
    source: CaptureSource;
  };

  Profile: undefined;
  About: undefined;
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

/** Makes `useNavigation()` typed with no explicit generics (doc 06 §11). */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}
