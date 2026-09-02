import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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

export type WizardStackParamList = {
  ChildIdentity: { childId?: string };
  ChildDetails: undefined;
  PermissionStep: { kind: 'location' | 'camera' };
  Confirmation: undefined;
  AssessmentPlaceholder: undefined;
};

export type ChildStackParamList = {
  ReadyToPlay: undefined;
  Report: undefined;
  ParentDetails: { readonly?: boolean };
  Support: { origin: 'ParentHome' | 'ReadyToPlay' };
};

export type ParentStackParamList = {
  ParentHome: undefined;
  AllChildren: undefined;
  ParentDetails: undefined;
  Support: { origin: 'ParentHome' | 'ReadyToPlay' };
  WizardPlaceholder: { childId?: string };
  ChildTabs: { childId: string };
};

export type AppStackParamList = {
  Parent: NavigatorScreenParams<ParentStackParamList>;
  UnityGame: { gameId: string };
  Gallery: undefined;
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
export type ParentScreenProps<T extends keyof ParentStackParamList> = NativeStackScreenProps<
  ParentStackParamList,
  T
>;
export type WizardScreenProps<T extends keyof WizardStackParamList> = NativeStackScreenProps<
  WizardStackParamList,
  T
>;
export type ChildScreenProps<T extends keyof ChildStackParamList> = NativeStackScreenProps<
  ChildStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}
