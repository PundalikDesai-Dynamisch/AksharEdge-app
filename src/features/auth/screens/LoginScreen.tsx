import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

import { Button, Screen, TextField } from '@components';
import { colors, spacing, typography, radii } from '@theme';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signInThunk, signInWithGoogleThunk } from '@/features/auth/auth.thunks';
import { clearAuthError } from '@/features/auth/auth.slice';
import { strings } from '@/constants/strings';

import type { AuthScreenProps } from '@/navigation/types';

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = (): void => {
    dispatch(clearAuthError());
    const newErrors: Record<string, string> = {};
    
    if (!email) newErrors.email = strings.auth.requiredFields;
    if (!password) newErrors.password = strings.auth.requiredFields;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    dispatch(signInThunk({ email, password }));
  };

  const handleGoogleLogin = (): void => {
    dispatch(clearAuthError());
    dispatch(signInWithGoogleThunk());
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.body}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>{strings.auth.loginSubtitle}</Text>

          {error && <Text style={styles.errorBanner}>{error.userMessage}</Text>}

          <TextField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder={strings.auth.emailPlaceholder}
            error={errors.email}
          />

          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secure={true}
            autoComplete="password"
            placeholder={strings.auth.passwordPlaceholder}
            error={errors.password}
          />

          <View style={styles.forgotPasswordContainer}>
            <Text 
              style={styles.forgotPasswordLink}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              Forgot Password?
            </Text>
          </View>

          <Button 
            label="Sign In" 
            onPress={handleLogin} 
            loading={isSubmitting} 
            disabled={isSubmitting}
            style={styles.loginButton} 
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

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
            <Text style={styles.googleButtonLabel}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text 
              style={styles.footerLink}
              onPress={() => navigation.navigate('Register')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  body: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.displaySmall,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xxl,
  },
  errorBanner: {
    ...typography.caption,
    color: colors.danger,
    backgroundColor: '#FFEBEB',
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordLink: {
    ...typography.caption,
    fontWeight: 'bold',
    color: colors.primary,
  },
  loginButton: {
    marginBottom: spacing.xxl,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  footer: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...typography.body,
    color: colors.textMuted,
  },
  footerLink: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});
