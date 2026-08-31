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

  /**
   * The two hard permission gates, spec §13–§16 and design.md §12.
   *
   * Written in full here, in Phase 1, so Phase 3 wires behaviour to finished copy instead of
   * inventing placeholder text under time pressure. Tone per design.md §10: reassuring, never
   * alarming — the blocked state must be unmistakable without being frightening.
   *
   * ⚠️ The headline follows AKSHAREDGE_SCREENS_SPEC.md §13 ("Where are you playing from?").
   * design.md §12 words the same screen as "We need your location". Both documents are
   * authoritative; the screen spec is the more specific of the two, so it wins here. Flagged for
   * a product decision rather than silently reconciled.
   */
  permissions: {
    tryAgain: 'Try Again',
    openSettings: 'Open Settings',
    granted: 'Access allowed',

    location: {
      title: 'Where are you playing from?',
      explanation:
        'We use your location once, to set up your child\'s profile. You will not need to type an address.',
      cta: 'Allow Location Access',
      deniedTitle: 'Location access is required',
      deniedExplanation:
        "We can't finish setting up your child's profile without it. Tap Try Again to allow location.",
      blockedExplanation:
        "Location is turned off for AksharEdge in your device settings. Open Settings to allow it, then come back here.",
      unavailableExplanation:
        "This device can't share a location, so we can't finish setting up the profile on it.",
    },

    camera: {
      title: 'We need the camera to play!',
      explanation:
        'The games use the camera to gently notice how your child looks at the screen while they play.',
      cta: 'Allow Camera Access',
      deniedTitle: 'Camera access is required',
      deniedExplanation:
        "Camera access is required to create a profile and start assessments. Tap Try Again to allow the camera.",
      blockedExplanation:
        "The camera is turned off for AksharEdge in your device settings. Open Settings to allow it, then come back here.",
      unavailableExplanation:
        "This device doesn't have a camera we can use, so the assessment games can't run on it.",
    },
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
