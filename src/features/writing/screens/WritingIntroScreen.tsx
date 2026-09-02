import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen, Mascot, Button } from '@components';
import { typography, spacing, colors } from '@theme';
import type { AppStackParamList } from '@/navigation/types';

type WritingIntroRouteProp = RouteProp<AppStackParamList, 'WritingIntro'>;

export function WritingIntroScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<WritingIntroRouteProp>();
  const { assessmentId } = route.params;

  const handleNext = () => {
    // We'll hardcode "ELEPHANT" for now, as planned.
    navigation.navigate('WritingInstruction', { 
      assessmentId, 
      promptText: 'ELEPHANT' 
    });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.mascotContainer}>
          <Mascot pose="waving" size="lg" />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Time to Write!</Text>
          <Text style={styles.description}>
            You did great on the games! Now we need you to write one word on a piece of paper.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button label="Let's Go!" onPress={handleNext} />
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
  mascotContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: colors.primaryDeep,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
