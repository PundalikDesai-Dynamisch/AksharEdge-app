import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

import { Button, Screen, TextField } from '@components';
import { colors, spacing, typography, radii } from '@theme';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signInThunk, signInWithGoogleThunk } from '@/features/auth/auth.thunks';
import { clearAuthError } from '@/features/auth/auth.slice';

import type { AuthScreenProps } from '@/navigation/types';

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleLogin = (): void => {
    dispatch(clearAuthError());
    setValidationError('');
    
    if (!email || !password) {
      setValidationError('Please enter both email and password.');
      return;
    }
    
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
          <Text style={styles.subtitle}>Sign in to your teacher account</Text>

          {error && <Text style={styles.errorBanner}>{error.userMessage}</Text>}
          {validationError ? <Text style={styles.errorBanner}>{validationError}</Text> : null}

          <TextField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="teacher@school.com"
          />

          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secure={true}
            autoComplete="password"
            placeholder="Enter your password"
          />

          <TouchableOpacity 
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

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
              Register here
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: 'bold',
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
