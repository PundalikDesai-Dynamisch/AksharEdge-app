import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

import { Button, Screen, TextField } from '@components';
import { colors, spacing, typography, radii } from '@theme';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerThunk, signInWithGoogleThunk } from '@/features/auth/auth.thunks';
import { clearAuthError } from '@/features/auth/auth.slice';
import { strings } from '@/constants/strings';

import type { AuthScreenProps } from '@/navigation/types';

export default function RegisterScreen({ navigation }: AuthScreenProps<'Register'>): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector(state => state.auth);

  const [fullName, setFullName] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = (): void => {
    dispatch(clearAuthError());
    const newErrors: Record<string, string> = {};
    
    if (!fullName) newErrors.fullName = strings.auth.requiredFields;
    if (contactMethod === 'email' && !email) newErrors.email = strings.auth.requiredFields;
    if (contactMethod === 'phone' && !phone) newErrors.phone = strings.auth.requiredFields;
    if (!password) newErrors.password = strings.auth.requiredFields;
    
    if (password && password !== confirmPassword) {
      newErrors.confirmPassword = strings.auth.passwordsDoNotMatch;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    
    // Fallback email if phone is used, to satisfy Firebase Auth for now.
    // In a real phone auth flow, this would use SMS OTP.
    const submitEmail = contactMethod === 'email' ? email : `${phone.replace(/\D/g, '')}@phone.aksharedge.local`;
    
    // Note: registerThunk expects { fullName, email, password }
    // Location and phone aren't pushed to the auth thunk directly in this phase as per "thunks are sound" constraint,
    // but the UI captures them.
    dispatch(registerThunk({ fullName, email: submitEmail, password }));
  };

  const handleGoogleRegister = (): void => {
    dispatch(clearAuthError());
    dispatch(signInWithGoogleThunk());
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.body}>
          <Text style={styles.title}>{strings.headers.register}</Text>
          <Text style={styles.subtitle}>{strings.auth.registerSubtitle}</Text>

          {error && <Text style={styles.errorBanner}>{error.userMessage}</Text>}

          <TextField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            placeholder={strings.auth.namePlaceholder}
            error={errors.fullName}
          />

          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, contactMethod === 'email' && styles.toggleActive]}
              onPress={() => { setContactMethod('email'); setErrors({}); }}
            >
              <Text style={[styles.toggleText, contactMethod === 'email' && styles.toggleTextActive]}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, contactMethod === 'phone' && styles.toggleActive]}
              onPress={() => { setContactMethod('phone'); setErrors({}); }}
            >
              <Text style={[styles.toggleText, contactMethod === 'phone' && styles.toggleTextActive]}>Phone</Text>
            </TouchableOpacity>
          </View>

          {contactMethod === 'email' ? (
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
          ) : (
            <TextField
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              error={errors.phone}
            />
          )}

          <TextField
            label="Location (Optional)"
            value={location}
            onChangeText={setLocation}
            autoCapitalize="words"
            placeholder={strings.auth.locationPlaceholder}
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
          
          <TextField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secure={true}
            placeholder={strings.auth.confirmPasswordPlaceholder}
            error={errors.confirmPassword}
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

          {/* 
            Google Sign-In Button
            This button is deliberately hand-rolled instead of using the standard <Button> component.
            Google has strict brand guidelines for sign-in buttons (specific shadow, border, 'G' logo styling) 
            that would pollute our core Button component if forced through its variant table. 
            Do not replace this with <Button>.
          */}
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
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    ...typography.button,
    color: colors.text,
  },
  toggleTextActive: {
    color: '#FFF',
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
