import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@theme';

import type { BadgeType } from '@assets/registry';
import type { MascotPose } from '@assets/registry';

import { Button } from './Button';
import { Confetti } from './Confetti';
import { Mascot } from './Mascot';
import { RewardBadge } from './RewardBadge';

interface RewardOverlayProps {
  visible: boolean;
  mascotPose: MascotPose;
  title: string;
  message?: string;
  ctaLabel: string;
  onPress: () => void;
  badge?: BadgeType;
}

/**
 * The celebration moment, serving both spec §21 (per-game completion, "Next Mission") and §26
 * (the final celebration, "You did it!" / "Done").
 *
 * One component for both because design.md §16 describes the same furniture in each — confetti,
 * a cheering mascot, a badge, one CTA — and the only real difference is the copy.
 *
 * A single action, deliberately: §16 specifies one "Done" CTA, and a child-facing celebration
 * with two competing choices is a worse celebration.
 */
export function RewardOverlay({
  visible,
  mascotPose,
  title,
  message,
  ctaLabel,
  onPress,
  badge = 'star',
}: RewardOverlayProps): React.JSX.Element {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        {/* Behind the card and pointerEvents="none", so it never blocks the CTA. */}
        <Confetti active={visible} />

        <View style={styles.card} accessibilityViewIsModal>
          <Mascot pose={mascotPose} size="sm" />
          <RewardBadge type={badge} size={96} />

          <Text style={styles.title}>{title}</Text>
          {message !== undefined && <Text style={styles.message}>{message}</Text>}

          <View style={styles.action}>
            <Button label={ctaLabel} onPress={onPress} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    ...shadows.lg,
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
  },
  title: {
    ...typography.displaySmall,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
});
