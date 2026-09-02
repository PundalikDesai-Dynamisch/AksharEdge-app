import { AppError } from '@/domain/errors/AppError';

import type { AppErrorCode } from '@/domain/errors/AppError';

/**
 * Absorbs SDK-specific failures so nothing above the data layer ever branches on a Firebase
 * error code. When this is swapped for a Node API, the HTTP equivalents map to the same
 * `AppError` values and no caller changes.
 */
const CODE_MAP: Readonly<Record<string, { code: AppErrorCode; message: string; retry: boolean }>> =
  {
    'firestore/permission-denied': {
      code: 'FIRESTORE_FAILED',
      message: "You don't have access to this. Try signing in again.",
      retry: false,
    },
    'firestore/unavailable': {
      code: 'NETWORK_UNAVAILABLE',
      message: 'No internet connection. Check your network and try again.',
      retry: true,
    },
    'firestore/deadline-exceeded': {
      code: 'NETWORK_UNAVAILABLE',
      message: 'That took too long. Try again.',
      retry: true,
    },
    'firestore/not-found': {
      code: 'FIRESTORE_FAILED',
      message: "We couldn't find that. It may have been removed.",
      retry: false,
    },
    'storage/unauthorized': {
      code: 'UPLOAD_FAILED',
      message: "You don't have permission to upload this.",
      retry: false,
    },
    'storage/retry-limit-exceeded': {
      code: 'UPLOAD_FAILED',
      message: "The upload didn't finish. Check your connection and try again.",
      retry: true,
    },
    'storage/canceled': {
      code: 'UPLOAD_FAILED',
      message: 'Upload cancelled.',
      retry: true,
    },
    'storage/quota-exceeded': {
      code: 'UPLOAD_FAILED',
      message: "We couldn't save that photo right now. Please try again later.",
      retry: true,
    },
  };

export function mapDataError(error: unknown, fallbackMessage: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const code = (error as { code?: string })?.code ?? '';
  const known = CODE_MAP[code];

  if (known !== undefined) {
    return new AppError(known.code, known.message + ' ' + String(error), error, known.retry);
  }

  return new AppError('UNKNOWN', String(error) + ' ' + fallbackMessage, error, true);
}
