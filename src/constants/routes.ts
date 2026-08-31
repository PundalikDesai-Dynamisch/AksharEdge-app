/**
 * Route names as values, so navigators and imperative callers cannot drift on a typo.
 * The param-list types that give these names their shape live in navigation/types.ts.
 *
 * Trimmed to the routes that still exist after the teacher-era screens were removed. Phases 2–4
 * add the parent, wizard, child-tab, and assessment routes.
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
  homeTab: 'HomeTab',
  gamesTab: 'GamesTab',

  unityGame: 'UnityGame',
} as const;
