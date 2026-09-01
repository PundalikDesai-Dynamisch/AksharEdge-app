import React, { useCallback } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Screen, WizardHeader, PermissionGate, PermissionDeniedState } from '@components';
import { usePermission } from '@/services/permissions/usePermission';
import { strings } from '@/constants/strings';
import type { WizardScreenProps } from '@/navigation/types';

export function PermissionStepScreen({ route, navigation }: WizardScreenProps<'PermissionStep'>): React.JSX.Element {
  const { kind } = route.params;
  const { status, request, openSettings } = usePermission(kind);

  // If granted (whether initially or after returning from settings), move forward automatically.
  useFocusEffect(
    useCallback(() => {
      if (status === 'granted') {
        if (kind === 'location') {
          navigation.navigate('PermissionStep', { kind: 'camera' });
        } else {
          navigation.navigate('Confirmation');
        }
      } else if (status === 'unavailable') {
        // According to specs, if unavailable, it can't be requested or fixed.
        // We skip automatically.
        if (kind === 'location') {
          navigation.navigate('PermissionStep', { kind: 'camera' });
        } else {
          navigation.navigate('Confirmation');
        }
      }
    }, [status, kind, navigation])
  );

  // Intercept the hardware back button when the gate is active
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (kind === 'camera') {
          // Hardware back on camera goes to location
          navigation.navigate('PermissionStep', { kind: 'location' });
          return true;
        } else {
          // Hardware back on location goes to details
          navigation.navigate('ChildDetails');
          return true;
        }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [kind, navigation])
  );

  const handleAction = async (): Promise<void> => {
    if (status === 'blocked') {
      await openSettings();
    } else {
      await request();
    }
  };

  const handleBack = (): void => {
    if (kind === 'camera') {
      navigation.navigate('PermissionStep', { kind: 'location' });
    } else {
      navigation.navigate('ChildDetails');
    }
  };

  const content = kind === 'location' ? strings.permissions.location : strings.permissions.camera;
  const mascotPose = kind === 'location' ? 'mapPin' : 'camera';

  return (
    <Screen>
      <WizardHeader 
        title={kind === 'location' ? 'Location Access' : 'Camera Access'}
        onBack={handleBack}
        steps={[
          { key: 'step1', label: 'Identity' },
          { key: 'step2', label: 'Details' },
          { key: 'step3', label: 'Confirm' }
        ]}
        // Progress sits between Details and Confirm
        currentIndex={2} 
        completedKeys={['step1', 'step2']}
      />
      <View style={styles.content}>
        {status === 'denied' || status === 'blocked' || status === 'unavailable' ? (
          <PermissionDeniedState
            mascotPose={mascotPose}
            title={content.deniedTitle}
            explanation={
              status === 'denied' ? content.deniedExplanation :
              status === 'blocked' ? content.blockedExplanation :
              content.unavailableExplanation
            }
            status={status}
            onRetry={handleAction}
            onOpenSettings={openSettings}
          />
        ) : (
          <PermissionGate 
            mascotPose={mascotPose}
            title={content.title}
            explanation={content.explanation}
            ctaLabel={content.cta}
            status={status}
            onRequest={handleAction} 
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
