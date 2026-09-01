import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { Button, Screen } from '@components';
import { strings } from '@/constants/strings';
import { colors, spacing, typography, radii } from '@theme';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signInWithGoogleThunk } from '@/features/auth/auth.thunks';
import { clearAuthError } from '@/features/auth/auth.slice';

import type { AuthScreenProps } from '@/navigation/types';

export default function WelcomeScreen({
  navigation,
}: AuthScreenProps<'Welcome'>): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector(state => state.auth);

  const handleLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const handleGoogleLogin = useCallback(() => {
    dispatch(clearAuthError());
    dispatch(signInWithGoogleThunk());
  }, [dispatch]);

  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.title}>{strings.app.welcomeTitle}</Text>
        <Text style={styles.subtitle}>{strings.app.welcomeSubtitle}</Text>
      </View>

      <View style={styles.actions}>
        {error && <Text style={styles.errorBanner}>{error.userMessage}</Text>}

        {/* 
          Google Sign-In Button
          This button is deliberately hand-rolled instead of using the standard <Button> component.
          Google has strict brand guidelines for sign-in buttons (specific shadow, border, 'G' logo styling) 
          that would pollute our core Button component if forced through its variant table. 
          Do not replace this with <Button>.
        */}
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isSubmitting}
        >
          <Text style={styles.googleButtonText}>G</Text>
          <Text style={styles.googleButtonLabel}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <Button label="Sign up with Email" onPress={handleRegister} disabled={isSubmitting} />
        <Button label="Log in" onPress={handleLogin} variant="secondary" disabled={isSubmitting} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.displayLarge,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  googleButtonText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#DB4437',
    marginRight: spacing.sm,
  },
  googleButtonLabel: {
    ...typography.button,
    color: colors.text,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
  },
  errorBanner: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
