import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Button, Card, Icon } from '@components';
import { colors, spacing, typography, IconName } from '@theme';
import type { ParentScreenProps } from '@/navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.xl * 2;

export function EmptyParentState(): React.JSX.Element {
  const navigation = useNavigation<ParentScreenProps<'ParentHome'>['navigation']>();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = () => {
    navigation.navigate('WizardPlaceholder', {});
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < 4) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card 1 */}
        <View style={styles.slide}>
          <Card style={styles.card}>
            <Icon name={IconName.user} size={64} color="primary" />
            <Text style={styles.cardTitle}>Add your child's profile</Text>
            <Text style={styles.cardBody}>Start by creating a profile for your child to track their progress.</Text>
          </Card>
        </View>

        {/* Card 2 */}
        <View style={styles.slide}>
          <Card style={styles.card}>
            <Icon name={IconName.gamepad} size={64} color="primary" />
            <Text style={styles.cardTitle}>Complete a fun app-based assessment</Text>
            <Text style={styles.cardBody}>Your child will play engaging mini-games to help us understand their learning style.</Text>
          </Card>
        </View>

        {/* Card 3 */}
        <View style={styles.slide}>
          <Card style={styles.card}>
            <Icon name={IconName.file} size={64} color="primary" />
            <Text style={styles.cardTitle}>Access your child's personalized report</Text>
            <Text style={styles.cardBody}>Receive actionable insights and recommendations based on their assessment.</Text>
          </Card>
        </View>

        {/* Card 4 */}
        <View style={styles.slide}>
          <Card style={styles.card}>
            <Icon name={IconName.user} size={64} color="primary" />
            <Text style={styles.cardTitle}>Add your child's profile</Text>
            <Text style={styles.cardBody}>Start by creating a profile for your child to track their progress.</Text>
            <Button
              label="Add Child Profile"
              onPress={handleNext}
              style={styles.cardAction}
            />
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeIndex === i && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <Button
          label="Skip"
          variant="ghost"
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    alignItems: 'center',
  },
  slide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: CARD_WIDTH,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  cardTitle: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  cardBody: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  cardAction: {
    marginTop: spacing.md,
    alignSelf: 'stretch',
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 16,
  },
});
