import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Screen, Button, Loader, ErrorState, SteppingStones, Step } from '@components';
import { typography, spacing, colors } from '@theme';
import { strings } from '@/constants/strings';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { startAssessmentSubscription } from '@features/assessment/assessment.thunks';
import { isPlayAvailable } from '@/domain/policies/reportAvailability';

const ROADMAP_STEPS: readonly Step[] = [
  { key: 'games', label: 'Play Games' },
  { key: 'writing', label: 'Writing' },
  { key: 'celebrate', label: 'Celebrate' },
];

export default function ReadyToPlayScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  
  const { assessment, loading, error, childId } = useAppSelector(state => state.assessment);

  if (loading && !assessment) {
    return (
      <Screen>
        <View style={styles.centerContent}>
          <Loader size="large" />
        </View>
      </Screen>
    );
  }

  if (error && !assessment) {
    return (
      <Screen>
        <View style={styles.centerContent}>
          <ErrorState 
            description={error}
            onRetry={() => {
              if (childId) {
                dispatch(startAssessmentSubscription(childId));
              }
            }} 
          />
        </View>
      </Screen>
    );
  }

  // Calculate completed keys
  const completedKeys: string[] = [];
  let currentIndex = 0;

  if (assessment) {
    const gamesComplete = assessment.missionPlan && assessment.missionPlan.length > 0 && assessment.missionPlan.length === assessment.completedGameIds.length;
    if (gamesComplete) {
      completedKeys.push('games');
      currentIndex = 1;
    }

    const writingComplete = assessment.writingStatus === 'uploaded';
    if (writingComplete) {
      completedKeys.push('writing');
      currentIndex = 2;
    }

    if (gamesComplete && writingComplete) {
      completedKeys.push('celebrate');
      currentIndex = 3; // All done
    }
  }

  const playActive = isPlayAvailable(assessment);
  const inProgress = assessment && assessment.completedGameIds.length > 0 && playActive;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{strings.app.readyToPlay}</Text>
          <Text style={styles.subtitle}>{strings.app.readyToPlaySubtitle}</Text>
        </View>

        <View style={styles.roadmap}>
          <SteppingStones 
            steps={ROADMAP_STEPS} 
            completedKeys={completedKeys} 
            currentIndex={currentIndex} 
          />
        </View>

        <View style={styles.footer}>
          {playActive ? (
            <Button 
              label={inProgress ? strings.actions.resume : strings.actions.start}
              onPress={() => {
                // In a future branch, this will navigate to the Mission Intro / Games flow
              }} 
            />
          ) : (
            <Text style={styles.statusMessage}>{strings.app.resultsPreparing}</Text>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: colors.primaryDeep,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  roadmap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  footer: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  statusMessage: {
    ...typography.bodyMuted,
    textAlign: 'center',
  },
});
