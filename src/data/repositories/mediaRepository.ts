export interface UploadImageInput {
  readonly localUri: string;
  readonly storagePath: string;
  readonly mimeType: string;
}

export interface UploadedImage {
  readonly storagePath: string;
  readonly downloadUrl: string;
  readonly sizeBytes: number;
}

export interface MediaRepository {
  /** Uploads the handwriting photo. Rejects with an AppError the UI can offer a retry on. */
  uploadImage(input: UploadImageInput): Promise<UploadedImage>;
  buildWritingPath(parts: {
    parentId: string;
    childId: string;
    assessmentId: string;
    fileName: string;
  }): string;
}
