import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

import { Button, Screen, TextField } from '@components';
import { colors, spacing, typography, radii } from '@theme';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerThunk, signInWithGoogleThunk } from '@/features/auth/auth.thunks';
import { clearAuthError } from '@/features/auth/auth.slice';

import type { AuthScreenProps } from '@/navigation/types';

export default function RegisterScreen({ navigation }: AuthScreenProps<'Register'>): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector(state => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleRegister = (): void => {
    dispatch(clearAuthError());
    setValidationError('');
    
    if (!fullName || !email || !password) {
      setValidationError('Please fill in all required fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }
    
    dispatch(registerThunk({ fullName, email, password }));
  };

  const handleGoogleRegister = (): void => {
    dispatch(clearAuthError());
    dispatch(signInWithGoogleThunk());
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.body}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to manage your students</Text>

          {error && <Text style={styles.errorBanner}>{error.userMessage}</Text>}
          {validationError ? <Text style={styles.errorBanner}>{validationError}</Text> : null}

          <TextField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            placeholder="Priya Sharma"
          />

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
            placeholder="At least 8 characters"
          />
          
          <TextField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secure={true}
            placeholder="Retype your password"
          />

          <Button 
            label="Register" 
            onPress={handleRegister} 
            loading={isSubmitting} 
            disabled={isSubmitting}
            style={styles.registerButton} 
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleRegister}
            disabled={isSubmitting}
          >
            <Text style={styles.googleButtonText}>G</Text>
            <Text style={styles.googleButtonLabel}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text 
              style={styles.footerLink}
              onPress={() => navigation.goBack()}
            >
              Sign In
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
  registerButton: {
    marginTop: spacing.md,
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
