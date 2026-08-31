import React, { useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Card, Screen } from '@components';
import { ROUTES } from '@/constants/routes';
import { strings } from '@/constants/strings';

import { colors, spacing, typography } from '@theme';

/**
 * Interim game index. The embedded Unity 2D runner stands in as the assessment game until
 * real game code exists; Phase 4 drives it from the assessment flow rather than from here.
 */
const GAMES = [{ id: 'simpleMobile', title: 'Simple Mobile Game' }] as const;

export function GamesScreen(): React.JSX.Element {
  const navigation = useNavigation();

  const openGame = useCallback(
    (gameId: string): void => {
      navigation.navigate(ROUTES.unityGame, { gameId });
    },
    [navigation],
  );

  return (
    <Screen scroll>
      <Text style={styles.title}>{strings.headers.games}</Text>

      {GAMES.map(game => (
        <Card
          key={game.id}
          onPress={() => openGame(game.id)}
          accessibilityLabel={`Play ${game.title}`}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>{game.title}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.displaySmall,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.text,
  },
});
