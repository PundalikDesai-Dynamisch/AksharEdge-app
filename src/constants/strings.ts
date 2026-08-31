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

  auth: {
    signOut: 'Sign out',
    signOutTitle: 'Sign out?',
    signOutMessage: "You'll need to sign in again to get back to your children's profiles.",
    signOutCancel: 'Stay signed in',
  },

  /** The child status pill on Parent Home and All Children — spec §7. */
  status: {
    not_started: 'Not started',
    in_progress: 'In progress',
    report_ready: 'Report ready',
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
    avatarGroup: 'Choose an avatar',
    avatarOption: (position: number): string => `Avatar ${position}`,
    goBack: 'Go back',
    pauseAndExit: 'Pause and exit',
    tabLocked: 'Locked',
    newResult: 'New result',
    stepProgress: (completed: number, total: number): string =>
      `Step ${completed} of ${total} complete`,
  },
} as const;
