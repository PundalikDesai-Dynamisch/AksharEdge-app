import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { DEFAULT_AVATAR_ID } from '@assets/registry';
import { AvatarPicker, Button, ConfirmDialog, Mascot, Screen } from '@components';
import { strings } from '@/constants/strings';
import { signOutThunk } from '@features/auth/auth.thunks';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { colors, spacing, typography } from '@theme';

import type { AvatarId } from '@/types/models';

/**
 * Placeholder so the app stays bootable while the teacher-era screens are gone.
 *
 * It doubles as the visual smoke test for the asset pipeline: if the heading is not in Baloo 2
 * the fonts are not registered, and if the mascot or avatars are missing then react-native-svg
 * is not linked. Both failures are silent otherwise — a font falls back to the system face and
 * an unrendered SVG just leaves a gap.
 *
 * ⚠️ TRANSITIONAL: the sign-out control below exists so the auth round trip can be exercised on
 * a device — nothing else in the app can currently reach `signOutThunk`, which left sign-out
 * untestable without wiping app data. It is not the real placement: spec §9 puts sign-out on
 * Edit Parent Details. Delete this block in `phase-2/all-children-and-details`.
 *
 * Phase 2 (`phase-2/parent-home`) replaces this screen entirely with the real two-state
 * Parent Home.
 */
export default function ParentHomeScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(state => state.auth.isSubmitting);
  const authError = useAppSelector(state => state.auth.error);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [avatarId, setAvatarId] = useState<AvatarId>(DEFAULT_AVATAR_ID);
  const navigation = useNavigation();

  const handleOpenGallery = useCallback((): void => {
    navigation.navigate('Gallery');
  }, [navigation]);

  const handleRequestSignOut = useCallback((): void => {
    setIsConfirmVisible(true);
  }, []);

  const handleCancelSignOut = useCallback((): void => {
    setIsConfirmVisible(false);
  }, []);

  // The dialog closes first so the confirmation is gone before the navigator swaps stacks —
  // dismissing a Modal on an unmounting screen leaves the scrim painted on some Android builds.
  const handleConfirmSignOut = useCallback((): void => {
    setIsConfirmVisible(false);
    dispatch(signOutThunk());
  }, [dispatch]);

  return (
    <Screen scroll>
      <View style={styles.body}>
        <Mascot pose="waving" size={140} />

        <Text style={styles.title}>{strings.app.name}</Text>
        <Text style={styles.subtitle}>{strings.app.welcomeSubtitle}</Text>

        <View style={styles.picker}>
          <AvatarPicker value={avatarId} onChange={setAvatarId} />
        </View>

        <Text style={styles.caption}>
          Heading in Baloo 2, body in Nunito, artwork through the asset registry.
        </Text>

        {authError !== null && (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {authError.userMessage}
          </Text>
        )}

        {/* Phase 1's component gallery. __DEV__-guarded on both sides — the route itself is only
            registered in AppNavigator under the same flag — because a dev-only screen with no
            dev-only way in is a screen nobody opens. */}
        {__DEV__ && (
          <Button
            label="Component gallery"
            onPress={handleOpenGallery}
            variant="secondary"
            fullWidth={false}
            style={styles.signOut}
          />
        )}

        <Button
          label={strings.auth.signOut}
          onPress={handleRequestSignOut}
          variant="ghost"
          loading={isSubmitting}
          disabled={isSubmitting}
          fullWidth={false}
          style={styles.signOut}
        />
      </View>

      <ConfirmDialog
        visible={isConfirmVisible}
        title={strings.auth.signOutTitle}
        message={strings.auth.signOutMessage}
        confirmLabel={strings.auth.signOut}
        cancelLabel={strings.auth.signOutCancel}
        onConfirm={handleConfirmSignOut}
        onCancel={handleCancelSignOut}
        illustration={<Mascot pose="thinking" size={96} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  title: {
    ...typography.displayLarge,
    color: colors.primaryDeep,
  },
  subtitle: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  picker: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
  caption: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  error: {
    ...typography.caption,
    color: colors.dangerDeep,
    textAlign: 'center',
  },
  signOut: {
    marginTop: spacing.lg,
  },
});
