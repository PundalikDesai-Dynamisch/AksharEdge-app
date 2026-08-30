import type { FileType } from '@/types/models';

/**
 * The normalized shape every capture source produces, so CapturePreviewScreen has no
 * source-specific branching (doc 14 §2). Created in Phase 0 rather than Phase 4 because
 * navigation/types.ts references it as a route param contract.
 *
 * Must stay plain and serializable — it travels through navigation params (doc 06 §2).
 */
export interface CapturedFileDraft {
  /** Wherever the native module put it — may be a temporary, revocable location. */
  tempUri: string;
  suggestedFileName: string;
  fileType: FileType;
  mimeType: string;
  /** Best-effort; re-measured after the file is copied into app storage. */
  sizeBytes: number;
}
