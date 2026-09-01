import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Screen, WizardHeader, Chip, Button } from '@components';
import { typography, spacing, colors, IconName } from '@theme';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import type { WizardScreenProps } from '@/navigation/types';
import type { SchoolingLevel, Gender } from '@/types/models';

import { setSchooling, setGender } from '../wizard.slice';

export function ChildDetailsScreen({ navigation }: WizardScreenProps<'ChildDetails'>): React.JSX.Element {
  const dispatch = useAppDispatch();
  
  const schooling = useAppSelector(state => state.wizard.schooling);
  const gender = useAppSelector(state => state.wizard.gender);

  const isValid = schooling !== null && gender !== null;

  const handleNext = () => {
    // Interim wiring: skip gates until they are built in Branch 24
    navigation.navigate('Confirmation');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Screen>
      <WizardHeader 
        title="More about them"
        onBack={handleBack}
        steps={[
          { key: 'step1', label: 'Identity' },
          { key: 'step2', label: 'Details' },
          { key: 'step3', label: 'Confirm' }
        ]}
        currentIndex={1}
        completedKeys={['step1']}
      />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Schooling</Text>
          <View style={styles.chipGrid}>
            {(['preK', 'kindergarten', 'grade1', 'grade2', 'grade3'] as SchoolingLevel[]).map((level) => (
              <Chip
                key={level}
                label={level}
                selected={schooling === level}
                onPress={() => dispatch(setSchooling(level))}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gender</Text>
          <View style={styles.chipGrid}>
            {(['male', 'female', 'other'] as Gender[]).map((g) => (
              <Chip
                key={g}
                label={g}
                selected={gender === g}
                onPress={() => dispatch(setGender(g))}
              />
            ))}
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
    paddingTop: spacing.xl,
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.text,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
