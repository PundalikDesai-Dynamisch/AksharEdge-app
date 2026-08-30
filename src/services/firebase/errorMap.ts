import { AppError } from '@/domain/errors/AppError';

export function mapAuthError(error: unknown): AppError {
  const code = (error as { code?: string })?.code || '';

  if (code === 'auth/invalid-email') {
    return new AppError('VALIDATION_FAILED', 'Enter a valid email address.', error, true);
  }
  if (code === 'auth/user-not-found') {
    return new AppError('AUTH_USER_NOT_FOUND', 'No account found for this email.', error, true);
  }
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return new AppError('AUTH_INVALID_CREDENTIALS', 'Incorrect email or password.', error, true);
  }
  if (code === 'auth/email-already-in-use') {
    return new AppError('AUTH_EMAIL_IN_USE', 'This email is already registered.', error, true);
  }
  if (code === 'auth/weak-password') {
    return new AppError('AUTH_WEAK_PASSWORD', 'Password is too weak — use at least 8 characters.', error, true);
  }
  if (code === 'auth/too-many-requests') {
    return new AppError('AUTH_TOO_MANY_REQUESTS', 'Too many attempts. Try again in a few minutes.', error, true);
  }
  if (code === 'auth/network-request-failed') {
    return new AppError('NETWORK_UNAVAILABLE', 'No internet connection.', error, true);
  }

  // Google sign in specific
  if (code === 'SIGN_IN_CANCELLED' || (error instanceof Error && error.message?.includes('SIGN_IN_CANCELLED'))) {
    return new AppError('AUTH_CANCELLED', 'Sign-in cancelled.', error, false);
  }
  if (code === 'PLAY_SERVICES_NOT_AVAILABLE') {
    return new AppError('UNKNOWN', "Google Sign-In isn't available on this device.", error, false);
  }

  return new AppError('UNKNOWN', `Error: ${code || 'Unknown'} - ${error instanceof Error ? error.message : String(error)}`, error, true);
}
