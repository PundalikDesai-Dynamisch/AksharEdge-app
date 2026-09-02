import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import type { GameResult } from '@/domain/entities/GameResult';
import { Button } from '@components/Button';
import { colors, spacing, typography } from '@theme';

export interface GameHostProps {
  gameId: string;
  sessionId: string;
  onResult: (result: Omit<GameResult, 'source'>) => void;
  onAbort: () => void;
}

/**
 * ⚠️ DEVELOPMENT ONLY
 *
 * This component fabricates data and acts as a deterministic stub for the Unity game host.
 * It must never be reachable in a production release. It provides a way to exercise the
 * complete Redux and navigation lifecycle without needing a real Unity payload.
 */
export function SyntheticGameStub({
  gameId,
  sessionId,
  onResult,
  onAbort,
}: GameHostProps): React.JSX.Element | null {
  if (!__DEV__) {
    // Failsafe: never render in prod
    return null;
  }

  const handleWin = () => {
    onResult({
      assessmentId: 'stub-ass-id',
      gameId,
      sessionId,
      durationMs: 120000,
      attempt: 1,
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      completed: true,
      schemaVersion: 1,
      raw: {},
      metrics: [
        { key: 'accuracy', label: 'Accuracy', value: 85, unit: 'ratio' },
        { key: 'reaction_time', label: 'Reaction Time', value: 1200, unit: 'ms' },
      ],
    });
  };

  const handleLose = () => {
    onResult({
      assessmentId: 'stub-ass-id',
      gameId,
      sessionId,
      durationMs: 45000,
      attempt: 1,
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      completed: false,
      schemaVersion: 1,
      raw: {},
      metrics: [
        { key: 'accuracy', label: 'Accuracy', value: 30, unit: 'ratio' },
        { key: 'reaction_time', label: 'Reaction Time', value: 3500, unit: 'ms' },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>[Synthetic Game Stub]</Text>
      <Text style={styles.subtitle}>
        Game: {gameId}
        {'\n'}
        Session: {sessionId}
      </Text>
      <View style={styles.actions}>
        <Button label="Simulate Win" onPress={handleWin} variant="primary" />
        <Button label="Simulate Loss" onPress={handleLose} variant="secondary" />
        <Button label="Abort (Quit)" onPress={onAbort} variant="ghost" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.xl,
  },
  title: {
    ...typography.displaySmall,
    color: colors.surface,
  },
  subtitle: {
    ...typography.body,
    color: colors.border,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing.md,
  },
});
