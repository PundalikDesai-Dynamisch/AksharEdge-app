/**
 * Cross-cutting string unions. String literals rather than enums so the same values move
 * unchanged between SQLite CHECK constraints, Firestore fields, and TypeScript (doc 23 §1).
 */

/**
 * The status a teacher sees for an upload. Note the asymmetry with SQLite: `upload_queue.status`
 * only ever holds 'pending' | 'uploading' | 'failed', because a successful upload leaves the
 * queue for `upload_history` (doc 11 §3). 'uploaded' therefore describes a history row.
 */
export type UploadStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';

export type QueueStatus = Extract<UploadStatus, 'pending' | 'uploading' | 'failed'>;

export type FileType = 'image' | 'pdf';

export type CaptureSource = 'scan' | 'gallery' | 'document';

export type AuthStatus = 'unknown' | 'signedOut' | 'signedIn';

export type AuthProvider = 'password' | 'google';

export type Gender = 'male' | 'female' | 'other' | 'unspecified';

export type ToastKind = 'success' | 'info' | 'warning' | 'error';

export type SyncStatus = 'idle' | 'syncing' | 'offline';
