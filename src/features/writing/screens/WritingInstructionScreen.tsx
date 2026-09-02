import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen, Button, Mascot, Card } from '@components';
import { typography, spacing, colors } from '@theme';
import type { AppStackParamList } from '@/navigation/types';

type WritingInstructionRouteProp = RouteProp<AppStackParamList, 'WritingInstruction'>;

export function WritingInstructionScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<WritingInstructionRouteProp>();
  const { assessmentId, promptText } = route.params;

  const handleNext = () => {
    navigation.navigate('WritingUpload', { assessmentId, promptText });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Mascot pose="thinking" size="sm" />
          <Text style={styles.title}>Please write this word:</Text>
        </View>

        <Card style={styles.wordCard}>
          <Text style={styles.promptWord}>{promptText}</Text>
        </Card>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionStep}>1. Write it big on blank paper</Text>
          <Text style={styles.instructionStep}>2. Take a clear photo</Text>
          <Text style={styles.instructionStep}>3. Upload it!</Text>
        </View>

        <View style={styles.footer}>
          <Button label="I'm ready to take a photo" onPress={handleNext} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.primaryDeep,
    marginLeft: spacing.md,
    flex: 1,
  },
  wordCard: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  promptWord: {
    ...typography.title,
    fontSize: 48,
    lineHeight: 56,
    color: colors.primaryDeep,
    letterSpacing: 2,
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  instructionStep: {
    ...typography.body,
    fontSize: 20,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
