import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Screen, TextField, Icon } from '@components';
import { colors, spacing, typography, radii, IconName } from '@theme';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendPasswordResetThunk } from '@/features/auth/auth.thunks';
import { clearAuthError } from '@/features/auth/auth.slice';

import type { AuthScreenProps } from '@/navigation/types';

export default function ForgotPasswordScreen({ navigation }: AuthScreenProps<'ForgotPassword'>): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleReset = async (): Promise<void> => {
    dispatch(clearAuthError());
    setValidationError('');
    
    if (!email) {
      setValidationError('Please enter your email address.');
      return;
    }
    
    const result = await dispatch(sendPasswordResetThunk(email));
    if (sendPasswordResetThunk.fulfilled.match(result)) {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <Screen>
        <View style={styles.successBody}>
          <Icon name={IconName.checkCircle} size={64} color="primary" />
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            If an account exists for {email}, we've sent instructions to reset your password.
          </Text>
          <Button 
            label="Back to Login" 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send you a reset link.</Text>

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

        <Button 
          label="Send Reset Link" 
          onPress={handleReset} 
          loading={isSubmitting} 
          disabled={isSubmitting}
          style={styles.submitButton} 
        />
        
        <Button 
          label="Cancel" 
          variant="secondary"
          onPress={() => navigation.goBack()} 
          disabled={isSubmitting}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  successBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.displaySmall,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xxl,
    textAlign: 'center',
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
  submitButton: {
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  backButton: {
    marginTop: spacing.xxl,
    width: '100%',
  },
});
