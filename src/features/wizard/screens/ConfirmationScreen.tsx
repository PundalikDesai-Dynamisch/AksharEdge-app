import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Screen, WizardHeader, Button, Card, Avatar } from '@components';
import { typography, spacing, colors } from '@theme';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import type { WizardScreenProps } from '@/navigation/types';

import { selectCanReachConfirmation } from '../wizard.slice';
import { createChildAndClearDraft } from '../wizard.thunks';

export function ConfirmationScreen({ navigation }: WizardScreenProps<'Confirmation'>): React.JSX.Element {
  const dispatch = useAppDispatch();
  
  const wizard = useAppSelector(state => state.wizard);
  const isValid = useAppSelector(selectCanReachConfirmation);
  
  const handleStart = async () => {
    try {
      await dispatch(createChildAndClearDraft()).unwrap();
      navigation.navigate('AssessmentPlaceholder');
    } catch {
      // Handle error in UI if needed
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Screen>
      <WizardHeader 
        title="Ready to go!"
        onBack={handleBack}
        steps={[
          { key: 'step1', label: 'Identity' },
          { key: 'step2', label: 'Details' },
          { key: 'step3', label: 'Confirm' }
        ]}
        currentIndex={2}
        completedKeys={['step1', 'step2']}
      />
      
      <View style={styles.content}>
        <Card style={styles.summaryCard}>
          <View style={styles.avatarRow}>
            {wizard.avatarId && <Avatar avatarId={wizard.avatarId} size="lg" />}
            <View style={styles.summaryDetails}>
              <Text style={styles.name}>{wizard.name}</Text>
              <Text style={styles.detailText}>{wizard.ageYears} years old</Text>
              <Text style={styles.detailText}>{wizard.schooling}</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button 
          label="Start Assessment"
          onPress={handleStart}
          disabled={!isValid}
          variant="primary"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  summaryCard: {
    padding: spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  summaryDetails: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.title,
    color: colors.text,
  },
  detailText: {
    ...typography.body,
    color: colors.textMuted,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
