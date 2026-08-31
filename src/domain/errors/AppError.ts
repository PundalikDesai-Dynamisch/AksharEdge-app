export type AppErrorCode =
  | 'NETWORK_UNAVAILABLE'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_EMAIL_IN_USE'
  | 'AUTH_WEAK_PASSWORD'
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_TOO_MANY_REQUESTS'
  | 'AUTH_CANCELLED'
  | 'PERMISSION_DENIED'
  | 'PERMISSION_BLOCKED'
  | 'FILE_TOO_LARGE'
  | 'FILE_NOT_FOUND'
  | 'FILE_COPY_FAILED'
  | 'UPLOAD_FAILED'
  | 'FIRESTORE_FAILED'
  | 'VALIDATION_FAILED'
  // Permissions are hard gates (CLAUDE.md §8), so each failure mode needs its own path.
  | 'PERMISSION_UNAVAILABLE'
  | 'LOCATION_UNAVAILABLE'
  | 'GEOCODING_FAILED'
  | 'CAMERA_UNAVAILABLE'
  // Unity is Android-only and its payloads cross an untyped string channel.
  | 'UNITY_UNAVAILABLE'
  | 'UNITY_INVALID_RESULT'
  | 'ASSESSMENT_NOT_FOUND'
  | 'REPORT_NOT_READY'
  | 'UNKNOWN';

/**
 * The one error type that crosses layer boundaries. The data layer maps every
 * SDK error into this; the application layer branches on `retryable`; the presentation layer
 * renders `userMessage` and never `cause`.
 */
export class AppError extends Error {
  constructor(
    readonly code: AppErrorCode,
    /** Already human-readable — this is what a parent sees. */
    readonly userMessage: string,
    /** The original error, logged but never displayed. */
    readonly cause?: unknown,
    readonly retryable: boolean = false,
  ) {
    super(userMessage);
    this.name = 'AppError';
  }
}
