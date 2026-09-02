import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { AppStackParamList } from '@/navigation/types';

import { Screen } from '@components/Screen';
import { Button } from '@components/Button';
import { Mascot } from '@components/Mascot';
import { colors, spacing, typography } from '@theme';

export function MissionIntroScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AppStackParamList, 'MissionIntro'>>();
  const { assessmentId, gameId } = route.params;

  const handleStart = () => {
    // We navigate to UnityGame and don't pop this. The game can pop itself or we pop to root.
    navigation.navigate('UnityGame', { assessmentId, gameId });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          <Mascot pose="waving" size="lg" />
          <Text style={styles.title}>Mission Time!</Text>
          <Text style={styles.subtitle}>Get ready to play the next game.</Text>
        </View>
        <View style={styles.footer}>
          <Button label="Start Mission" onPress={handleStart} variant="primary" />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  title: {
    ...typography.displaySmall,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    paddingBottom: spacing.md,
  },
});
