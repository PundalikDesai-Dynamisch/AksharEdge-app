import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchCamera, type Asset } from 'react-native-image-picker';

import { Screen, Button, ErrorState, PermissionDeniedState } from '@components';
import { typography, spacing, colors } from '@theme';
import type { AppStackParamList } from '@/navigation/types';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { uploadWritingSample } from '@features/assessment/assessment.thunks';
import { usePermission } from '@/services/permissions/usePermission';

type WritingUploadRouteProp = RouteProp<AppStackParamList, 'WritingUpload'>;

export function WritingUploadScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<WritingUploadRouteProp>();
  const dispatch = useAppDispatch();
  const { assessmentId, promptText } = route.params;

  const { status, request, openSettings } = usePermission('camera');

  const [photo, setPhoto] = useState<Asset | null>(null);
  const [retakeCount, setRetakeCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const parentId = useAppSelector(state => state.auth.parent?.parentId);
  const childId = useAppSelector(state => state.assessment.childId);

  const handleTakePic = async () => {
    if (status !== 'granted') {
      await request();
      return; // Stop. They will tap the button again if they are granted, or the auto-recheck will handle it.
    }

    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.8,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorMessage || !result.assets || result.assets.length === 0) {
      setErrorMsg(result.errorMessage || 'Failed to capture photo.');
      return;
    }

    if (photo) {
      // If we already had a photo, we are retaking
      setRetakeCount(prev => prev + 1);
    }
    
    setPhoto(result.assets?.[0] ?? null);
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!photo || !photo.uri || !parentId || !childId) return;

    setUploading(true);
    setErrorMsg(null);

    const fileName = photo.fileName || `writing_${Date.now()}.jpg`;
    const mimeType = photo.type || 'image/jpeg';
    const sizeBytes = photo.fileSize || 0;

    try {
      await dispatch(
        uploadWritingSample({
          localUri: photo.uri,
          mimeType,
          sizeBytes,
          assessmentId,
          promptText,
          retakeCount,
          parentId,
          childId,
          fileName,
        })
      ).unwrap();

      // Success
      navigation.navigate('WritingConfirmation', { assessmentId });
    } catch (e: any) {
      const msg = e?.message || e?.error?.message || (typeof e === 'string' ? e : JSON.stringify(e));
      setErrorMsg(msg);
    } finally {
      setUploading(false);
    }
  };

  // If permissions are permanently blocked or denied and we're trying to take a pic:
  // Actually, we should just show the permission denied state if they don't have it and it's blocked.
  if (status === 'blocked' || status === 'denied') {
    return (
      <Screen>
        <View style={styles.container}>
          <PermissionDeniedState
            mascotPose="camera"
            title="Camera Access Needed"
            explanation="We need camera access so you can take a picture of your writing."
            status={status}
            onRetry={request}
            onOpenSettings={openSettings}
          />
        </View>
      </Screen>
    );
  }

  if (errorMsg) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <ErrorState
            description={errorMsg}
            onRetry={photo ? handleSubmit : handleTakePic}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Take a Photo</Text>
        </View>

        <View style={styles.content}>
          {photo ? (
            <Image 
              source={{ uri: photo.uri }} 
              style={styles.previewImage} 
              resizeMode="contain" 
            />
          ) : (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderText}>No photo yet</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {uploading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              {photo ? (
                <>
                  <Button label="Retake Photo" onPress={handleTakePic} variant="secondary" style={styles.actionBtn} />
                  <Button label="Submit" onPress={handleSubmit} style={styles.actionBtn} />
                </>
              ) : (
                <Button label="Open Camera" onPress={handleTakePic} />
              )}
            </>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: colors.primaryDeep,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: spacing.sm,
  },
  placeholderBox: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.bodyMuted,
  },
  footer: {
    paddingVertical: spacing.lg,
    flexDirection: 'column',
    gap: spacing.md,
  },
  actionBtn: {
    width: '100%',
  },
});
