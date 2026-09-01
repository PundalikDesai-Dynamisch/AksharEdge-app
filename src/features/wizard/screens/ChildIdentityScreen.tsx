import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { Screen, WizardHeader, TextField, AvatarPicker, Icon, Button } from '@components';
import { typography, spacing, colors, IconName } from '@theme';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import type { WizardScreenProps } from '@/navigation/types';

import type { AvatarId } from '@/types/models';

import { setName, setAvatarId, setAgeYears, selectStep1Valid } from '../wizard.slice';
import { loadChildForEdit } from '../wizard.thunks';

const AgePicker = ({ value, onChange }: { value: number | null; onChange: (v: number) => void }) => {
  const current = value ?? 5;

  return (
    <View style={styles.agePicker}>
      <TouchableOpacity 
        style={[styles.ageButton, current <= 3 && styles.ageButtonDisabled]} 
        disabled={current <= 3}
        onPress={() => onChange(current - 1)}
        accessibilityRole="button"
        accessibilityLabel="Decrease age"
      >
        <Icon name={IconName.chevronLeft} size={24} color={current <= 3 ? 'textMuted' : 'primaryDeep'} />
      </TouchableOpacity>
      
      <View style={styles.ageValueContainer}>
        <Text style={styles.ageValue}>{value ?? '-'}</Text>
        <Text style={styles.ageLabel}>years old</Text>
      </View>

      <TouchableOpacity 
        style={[styles.ageButton, current >= 18 && styles.ageButtonDisabled]} 
        disabled={current >= 18}
        onPress={() => onChange(current + 1)}
        accessibilityRole="button"
        accessibilityLabel="Increase age"
      >
        <Icon name={IconName.chevronRight} size={24} color={current >= 18 ? 'textMuted' : 'primaryDeep'} />
      </TouchableOpacity>
    </View>
  );
};

export function ChildIdentityScreen({ route, navigation }: WizardScreenProps<'ChildIdentity'>): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { childId } = route.params || {};
  
  const name = useAppSelector(state => state.wizard.name);
  const avatarId = useAppSelector(state => state.wizard.avatarId);
  const ageYears = useAppSelector(state => state.wizard.ageYears);
  const isValid = useAppSelector(selectStep1Valid);

  useEffect(() => {
    if (childId) {
      dispatch(loadChildForEdit(childId));
    }
  }, [childId, dispatch]);

  const handleNext = () => {
    navigation.navigate('ChildDetails');
  };

  return (
    <Screen>
      <WizardHeader 
        title="Who is playing?"
        // subtitle omitted, not supported by WizardHeader
        // onBack omitted intentionally for step 1
        steps={[
          { key: 'step1', label: 'Identity' },
          { key: 'step2', label: 'Details' },
          { key: 'step3', label: 'Confirm' }
        ]}
        currentIndex={0}
        completedKeys={[]}
      />
      
      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <AvatarPicker 
            value={avatarId as AvatarId} 
            onChange={(id) => dispatch(setAvatarId(id))} 
          />
        </View>

        <View style={styles.formSection}>
          <TextField
            label="First Name"
            value={name}
            onChangeText={(text) => dispatch(setName(text))}
            placeholder="e.g. Maya"
            autoCapitalize="words"
            returnKeyType="done"
          />

          <View style={styles.ageSection}>
            <Text style={styles.sectionTitle}>Age</Text>
            <AgePicker 
              value={ageYears} 
              onChange={(val) => dispatch(setAgeYears(val))} 
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          label="Next"
          onPress={handleNext}
          disabled={!isValid}
          variant="primary"
          icon={IconName.arrowRight}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  formSection: {
    gap: spacing.xl,
  },
  ageSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.text,
  },
  agePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageButtonDisabled: {
    backgroundColor: colors.border,
  },
  ageValueContainer: {
    flex: 1,
    alignItems: 'center',
  },
  ageValue: {
    ...typography.displaySmall,
    color: colors.text,
  },
  ageLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
