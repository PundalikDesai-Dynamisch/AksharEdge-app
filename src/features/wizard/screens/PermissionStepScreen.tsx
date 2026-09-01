import React, { useCallback } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Screen, WizardHeader, PermissionGate, PermissionDeniedState } from '@components';
import { usePermission } from '@/services/permissions/usePermission';
import { strings } from '@/constants/strings';
import type { WizardScreenProps } from '@/navigation/types';

import { useAppDispatch } from '@store/hooks';
import { setLocation } from '../wizard.slice';
import { locationService } from '@/services/location/locationService';

export function PermissionStepScreen({ route, navigation }: WizardScreenProps<'PermissionStep'>): React.JSX.Element {
  const { kind } = route.params;
  const { status, isLoading, hasRequested, request, openSettings } = usePermission(kind);
  const dispatch = useAppDispatch();

  // If granted (whether initially or after returning from settings), move forward automatically.
  useFocusEffect(
    useCallback(() => {
      if (isLoading) return;

      if (status === 'granted') {
        if (kind === 'location') {
          // Trigger geocoding in the background (fire-and-forget) while we wait
          (async () => {
            const coords = await locationService.getCurrentPosition();
            if (coords) {
              const label = await locationService.reverseGeocode(coords.lat, coords.lng);
              dispatch(setLocation({
                lat: coords.lat,
                lng: coords.lng,
                label: label || 'Location saved',
                capturedAt: new Date().toISOString(),
              }));
            }
          })();
        }

        // Delay the auto-advance so the user can see the "Access allowed" state
        const timer = setTimeout(() => {
          if (kind === 'location') {
            navigation.push('PermissionStep', { kind: 'camera' });
          } else {
            navigation.navigate('Confirmation');
          }
        }, 1200);

        return () => clearTimeout(timer);
      } else if (status === 'unavailable') {
        // According to specs, if unavailable, it can't be requested or fixed.
        // We skip automatically.
        if (kind === 'location') {
          navigation.push('PermissionStep', { kind: 'camera' });
        } else {
          navigation.navigate('Confirmation');
        }
      }
    }, [status, isLoading, kind, navigation, dispatch])
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (kind === 'camera') {
          // Hardware back on camera goes to location
          navigation.goBack();
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
      navigation.goBack();
    } else {
      navigation.navigate('ChildDetails');
    }
  };

  const content = kind === 'location' ? strings.permissions.location : strings.permissions.camera;
  const mascotPose = kind === 'location' ? 'mapPin' : 'camera';

  const shouldShowDenied = status === 'blocked' || status === 'unavailable' || (status === 'denied' && hasRequested);

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
        {shouldShowDenied ? (
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
