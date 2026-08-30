/**
 * All teacher-facing copy. Centralised so tone stays consistent with doc 07 §16.4 —
 * sentence case, no jargon, every error says what happened and what to do next.
 * Later phases add their own sections here rather than inlining text in a screen.
 */
export const strings = {
  app: {
    name: 'AksharEdge Teacher',
    welcomeTitle: 'AksharEdge for Teachers',
  },

  common: {
    somethingWentWrong: 'Something went wrong',
    tryAgain: 'Try again',
    confirm: 'Confirm',
    cancel: 'Cancel',
    search: 'Search',
    clearSearch: 'Clear search',
    retry: 'Retry',
    loading: 'Loading…',
  },

  network: {
    offline: "You're offline",
    /** doc 07 §6 — the pending count is what makes the banner actionable rather than noise. */
    offlineWithPending: (count: number): string =>
      `You're offline — ${count} ${count === 1 ? 'upload' : 'uploads'} waiting`,
  },

  headers: {
    login: 'Sign In',
    register: 'Create Account',
    forgotPassword: 'Reset Password',
    dashboard: 'Dashboard',
    students: 'Students',
    uploads: 'Uploads',
    settings: 'Settings',
    addStudent: 'Add Student',
    editStudent: 'Edit Student',
    profile: 'Profile',
    about: 'About',
    games: 'Games',
    review: (count: number): string => `Review (${count})`,
  },

  accessibility: {
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    clearSearchField: 'Clear search field',
    closeDialog: 'Close dialog',
    dismissToast: 'Dismiss notification',
  },
} as const;
