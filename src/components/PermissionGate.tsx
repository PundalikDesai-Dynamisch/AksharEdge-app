import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, IconName, spacing, typography } from '@theme';

import type { MascotPose } from '@assets/registry';
import type { PermissionStatus } from '@/types/models';

import { Button } from './Button';
import { Mascot } from './Mascot';

interface PermissionGateProps {
  mascotPose: MascotPose;
  title: string;
  explanation: string;
  ctaLabel: string;
  onRequest: () => void;
  status: PermissionStatus;
}

/**
 * The explanation/request face of a mandatory permission — design.md §10 states 1–3, used
 * identically by Location (spec §13) and Camera (spec §15). The two differ only in copy, mascot
 * and which permission the *screen* checks; nothing about this component knows which is which.
 *
 * ⚠️ THE PROP LIST IS THE GUARANTEE. CLAUDE.md §8 forbids Skip, Maybe later, Continue anyway and
 * any hidden forward navigation on a mandatory gate. The most reliable way to hold that is a
 * component that has no way to express one: there is exactly one action, no secondary, no
 * dismiss, no close affordance, and no `onSkip`-shaped prop anywhere. If a later change wants to
 * add one, that change is wrong — read CLAUDE.md §8 before touching this file.
 *
 * Presentation only. It receives `status`; it never asks the OS. That is what stops a cached
 * boolean from ever standing in for real permission state — this component has no state to cache.
 */
export function PermissionGate({
  mascotPose,
  title,
  explanation,
  ctaLabel,
  onRequest,
  status,
}: PermissionGateProps): React.JSX.Element {
  const isRequesting = status === 'requesting';
  const isGranted = status === 'granted';

  return (
    <View style={styles.container}>
      <Mascot pose={mascotPose} size="md" />

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.explanation}>{explanation}</Text>

      <View style={styles.action}>
        <Button
          // Granted is a real, momentary state (design.md §10 state 3): the screen advances on
          // grant, but the button must never read as "still needs doing" in the meantime.
          label={isGranted ? strings.permissions.granted : ctaLabel}
          icon={isGranted ? IconName.checkCircle : undefined}
          onPress={onRequest}
          // The OS dialog is up — a second tap must not queue a second request.
          loading={isRequesting}
          disabled={isRequesting || isGranted}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.displaySmall,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  explanation: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
  },
});
