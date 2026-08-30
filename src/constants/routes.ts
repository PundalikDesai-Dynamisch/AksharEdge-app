/**
 * Route names as values, so navigators and imperative callers cannot drift on a typo.
 * The param-list types that give these names their shape live in navigation/types.ts.
 */
export const ROUTES = {
  splash: 'Splash',
  auth: 'Auth',
  app: 'App',

  welcome: 'Welcome',
  login: 'Login',
  register: 'Register',
  forgotPassword: 'ForgotPassword',

  mainTabs: 'MainTabs',
  dashboardTab: 'DashboardTab',
  studentsTab: 'StudentsTab',
  historyTab: 'HistoryTab',
  settingsTab: 'SettingsTab',
  gamesTab: 'GamesTab',

  addEditStudent: 'AddEditStudent',
  studentDetail: 'StudentDetail',
  uploadOptions: 'UploadOptions',
  capturePreview: 'CapturePreview',
  profile: 'Profile',
  about: 'About',
  unityGame: 'UnityGame',
} as const;
