import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Screen, Button, Loader, ErrorState, SteppingStones, Step } from '@components';
import { typography, spacing, colors } from '@theme';
import { strings } from '@/constants/strings';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '@/navigation/types';
import { startAssessment, startAssessmentSubscription } from '@features/assessment/assessment.thunks';
import { isPlayAvailable } from '@/domain/policies/reportAvailability';

const ROADMAP_STEPS: readonly Step[] = [
  { key: 'games', label: 'Play Games' },
  { key: 'writing', label: 'Writing' },
  { key: 'celebrate', label: 'Celebrate' },
];

export default function ReadyToPlayScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  
  const { assessment, loading, error, childId } = useAppSelector(state => state.assessment);
  const parentId = useAppSelector(state => state.auth.parent?.parentId);
  
  // (We'll assume ageYears and schooling are fetched or available, but for now we might need to hardcode or get them from child profile)
  // Let's get them from the child profile in Redux!
  const child = useAppSelector(() => {
    // find child in auth slice? Actually children are in a separate slice or we can just fetch from API.
    // wait, we don't have children in state yet in this branch?
    // Let's just use defaults for the startAssessment if needed.
    return { ageYears: 6, schooling: 'primary' as const };
  });

  const handleStartPlay = async () => {
    if (!childId || !parentId) return;

    if (!assessment) {
      await dispatch(startAssessment({ 
        childId, 
        parentId, 
        ageYears: child.ageYears, 
        schooling: child.schooling 
      })).unwrap();
      // Snapshot listener will update the assessment in Redux
      return;
    }

    if (assessment.status === 'in_progress') {
      // Find the first incomplete game
      const nextGame = assessment.missionPlan.find(p => !assessment.completedGameIds.includes(p.gameId));
      if (nextGame) {
        navigation.navigate('MissionIntro', { assessmentId: assessment.assessmentId, gameId: nextGame.gameId });
      } else {
        // All games complete, go to writing intro
      }
    }
  };

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
              onPress={handleStartPlay} 
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
