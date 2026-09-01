/**
 * The only place `console.*` may be called (doc 23 §5). `debug`/`info` are no-ops in release
 * so development tracing never ships, while `warn`/`error` always run — a silenced error in
 * production is how a "silent failure" (doc 01 §1) reaches a user.
 */

type LogContext = Record<string, unknown>;

function isDev(): boolean {
  return typeof __DEV__ !== 'undefined' && __DEV__;
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (!isDev()) {
      return;
    }
    console.log(`[debug] ${message}`, context ?? '');
  },

  info(message: string, context?: LogContext): void {
    if (!isDev()) {
      return;
    }
    console.info(`[info] ${message}`, context ?? '');
  },

  /** `error` is the original error object, kept for its stack trace — never stringify it away. */
  warn(message: string, error?: unknown, context?: LogContext): void {
    console.warn(`[warn] ${message}`, error ?? '', context ?? '');
  },

  error(message: string, error: unknown, context?: LogContext): void {
    console.error(`[error] ${message}`, error, context ?? '');
  },
} as const;
