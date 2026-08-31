/**
 * All user-facing copy. Centralised so tone stays consistent —
 * sentence case, no jargon, every error says what happened and what to do next.
 * Later phases add their own sections here rather than inlining text in a screen.
 */
export const strings = {
  app: {
    name: 'AksharEdge',
    welcomeTitle: 'Welcome to AksharEdge',
    welcomeSubtitle: 'A playful way to understand how your child learns',
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
    register: 'Create Account',
    forgotPassword: 'Reset Password',
    home: 'Home',
    games: 'Games',
  },

  accessibility: {
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    clearSearchField: 'Clear search field',
    closeDialog: 'Close dialog',
    dismissToast: 'Dismiss notification',
  },
} as const;
