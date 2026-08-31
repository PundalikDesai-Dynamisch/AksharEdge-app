import { getDownloadURL, getStorage, putFile, ref } from '@react-native-firebase/storage';

import type {
  MediaRepository,
  UploadImageInput,
  UploadedImage,
} from '@data/repositories/mediaRepository';

import { mapDataError } from './errorMap';

export const firebaseMediaRepository: MediaRepository = {
  async uploadImage(input: UploadImageInput): Promise<UploadedImage> {
    try {
      const storageRef = ref(getStorage(), input.storagePath);
      const task = await putFile(storageRef, input.localUri, {
        contentType: input.mimeType,
      });
      const downloadUrl = await getDownloadURL(storageRef);

      return {
        storagePath: input.storagePath,
        downloadUrl,
        sizeBytes: task.totalBytes,
      };
    } catch (error) {
      throw mapDataError(error, "We couldn't upload that photo. Please try again.");
    }
  },

  buildWritingPath({ parentId, childId, assessmentId, fileName }): string {
    // Mirrors the Storage security rules, which scope every object under its owning parent.
    return `parents/${parentId}/children/${childId}/assessments/${assessmentId}/writing/${fileName}`;
  },
};
