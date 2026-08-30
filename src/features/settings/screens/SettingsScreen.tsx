import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Button, ConfirmDialog, Screen } from '@components';
import { setAuthState } from '@features/auth/auth.slice';
import { useAppDispatch } from '@store/hooks';
import { spacing, typography } from '@theme';

/** Stub — doc 07 §13 implements this fully in Phase 7. */
export default function SettingsScreen(): React.JSX.Element {
  // No generic needed: the ReactNavigation.RootParamList augmentation types this (doc 06 §11).
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);

  const handleOpenProfile = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  const handleOpenAbout = useCallback(() => {
    navigation.navigate('About');
  }, [navigation]);

  const handleAskSignOut = useCallback(() => {
    setIsConfirmingSignOut(true);
  }, []);

  const handleCancelSignOut = useCallback(() => {
    setIsConfirmingSignOut(false);
  }, []);

  const handleConfirmSignOut = useCallback(() => {
    // TODO(phase-1): replace with signOutThunk — Firebase + Google, local queue preserved
    // (doc 12 §8). Until then this only flips the gate so the Auth stack is reachable.
    setIsConfirmingSignOut(false);
    dispatch(setAuthState({ status: 'signedOut', teacher: null }));
  }, [dispatch]);

  return (
    <Screen scroll edges={{ top: false }}>
      <View style={styles.body}>
        <Text style={styles.route}>SettingsTab</Text>
      </View>

      <View style={styles.actions}>
        <Button label="Profile" onPress={handleOpenProfile} variant="secondary" />
        <Button label="About" onPress={handleOpenAbout} variant="secondary" />
        <Button label="Sign Out" onPress={handleAskSignOut} variant="destructive" />
      </View>

      <ConfirmDialog
        visible={isConfirmingSignOut}
        title="Sign out?"
        message="Uploads waiting on this device are kept and will resume when you sign in again."
        confirmLabel="Sign Out"
        destructive
        onConfirm={handleConfirmSignOut}
        onCancel={handleCancelSignOut}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  route: {
    ...typography.title,
  },
  actions: {
    gap: spacing.md,
  },
});
