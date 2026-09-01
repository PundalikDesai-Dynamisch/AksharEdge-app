import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { Button, Screen, TextField, Card } from '@components';
import { updateParentThunk } from '@features/parent/parent.thunks';
import { signOutThunk } from '@features/auth/auth.thunks';
import { colors, spacing, typography, IconName } from '@theme';
import type { ParentScreenProps } from '@/navigation/types';
import type { UpdateParentPayload } from '@features/parent/parent.thunks';

export default function ParentDetailsScreen(): React.JSX.Element {
  const navigation = useNavigation<ParentScreenProps<'ParentDetails'>['navigation']>();
  const dispatch = useAppDispatch();
  const parent = useAppSelector(state => state.auth.parent);

  const [fullName, setFullName] = useState(parent?.fullName || '');
  const [phone, setPhone] = useState(parent?.phone || '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);
    
    const patch: UpdateParentPayload = {
      fullName,
      phone: phone || null,
    };
    
    if (isPasswordExpanded && password) {
      patch.password = password;
    }

    try {
      await dispatch(updateParentThunk(patch)).unwrap();
      // On success, go back or show a toast
      navigation.goBack();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    dispatch(signOutThunk());
  };

  return (
    <Screen scroll edges={{ top: true, bottom: true }}>
      <View style={styles.container}>
        
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TextField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            returnKeyType="next"
          />
          <TextField
            label="Phone Number (Optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="done"
          />
        </Card>

        {parent?.authProvider === 'password' && (
          <Card style={styles.section}>
            <View style={styles.passwordHeader}>
              <Text style={styles.sectionTitle}>Security</Text>
              <Button
                label={isPasswordExpanded ? "Cancel" : "Change Password"}
                variant="ghost"
                fullWidth={false}
                onPress={() => {
                  setIsPasswordExpanded(!isPasswordExpanded);
                  if (isPasswordExpanded) setPassword('');
                }}
              />
            </View>
            
            {isPasswordExpanded && (
              <TextField
                label="New Password"
                value={password}
                onChangeText={setPassword}
                secure
                returnKeyType="done"
              />
            )}
          </Card>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.actions}>
          <Button
            label="Save Changes"
            onPress={handleSave}
            loading={isSubmitting}
            disabled={isSubmitting || (fullName === parent?.fullName && phone === (parent?.phone || '') && !password)}
          />
          <Button
            label="Sign Out"
            variant="secondary"
            onPress={handleSignOut}
            icon={IconName.lock}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  section: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.primaryDeep,
    marginBottom: spacing.xs,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    ...typography.caption,
    color: colors.dangerDeep,
    textAlign: 'center',
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});
