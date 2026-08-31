/**
 * Firestore hands back `Timestamp` objects, which are not serializable and would trip the
 * strict `serializableCheck` in the store. Everything above this layer sees ISO strings.
 */

interface TimestampLike {
  toDate(): Date;
}

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as TimestampLike).toDate === 'function'
  );
}

/** Timestamp | string | null → ISO string, using `fallback` when the field is absent. */
export function toIso(value: unknown, fallback: string): string {
  if (isTimestampLike(value)) {
    return value.toDate().toISOString();
  }

  return typeof value === 'string' ? value : fallback;
}

export function toIsoOrNull(value: unknown): string | null {
  if (isTimestampLike(value)) {
    return value.toDate().toISOString();
  }

  return typeof value === 'string' ? value : null;
}

export function nowIso(): string {
  return new Date().toISOString();
}
