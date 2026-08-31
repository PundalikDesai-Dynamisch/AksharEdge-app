import type { WritingStatus } from '@/types/models';

/**
 * The handwriting photo a grown-up captures and uploads. The image itself lives in Storage;
 * this is the metadata row that points at it.
 */
export interface WritingSample {
  readonly sampleId: string;
  readonly assessmentId: string;
  readonly storagePath: string;
  /** Null until the upload completes — its absence is what makes a retry detectable. */
  readonly downloadUrl: string | null;
  /** The word or sentence the child was asked to write. */
  readonly promptText: string;
  readonly capturedAt: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly retakeCount: number;
  readonly status: WritingStatus;
}
