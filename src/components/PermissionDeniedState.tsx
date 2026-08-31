import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, IconName, radii, spacing, typography } from '@theme';

import type { MascotPose } from '@assets/registry';
import type { PermissionStatus } from '@/types/models';

import { Button } from './Button';
import { Icon } from './Icon';
import { Mascot } from './Mascot';

/** Only the three states that actually block. `granted` and `requesting` belong to the gate. */
type BlockedStatus = Extract<PermissionStatus, 'denied' | 'blocked' | 'unavailable'>;

interface PermissionDeniedStateProps {
  mascotPose: MascotPose;
  title: string;
  explanation: string;
  status: BlockedStatus;
  onRetry: () => void;
  onOpenSettings: () => void;
}

/**
 * The blocking face of a mandatory permission — design.md §10 states 4–8, shared by Location
 * (spec §14) and Camera (spec §16).
 *
 * The `denied` vs `blocked` split is the entire point of this component:
 *
 *   denied      re-requesting can still succeed  → "Try Again"
 *   blocked     re-requesting is a silent no-op  → "Open Settings" instead, because a Try Again
 *               that does nothing visible is a lie to the user
 *   unavailable the device has no such capability → neither button helps, so neither is offered
 *
 * `unavailable` deliberately renders no forward action. That is not a dead-end screen in the
 * CLAUDE.md §7 sense — the wizard's own back affordance still works — but there is genuinely no
 * way forward on a device that cannot do this, and inventing a button would imply otherwise.
 *
 * Tone per design.md §10: the blocked state must be unmistakable without being frightening.
 */
export function PermissionDeniedState({
  mascotPose,
  title,
  explanation,
  status,
  onRetry,
  onOpenSettings,
}: PermissionDeniedStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Mascot pose={mascotPose} size="sm" />

      {/* A lock glyph as well as warm colour: design.md §18 forbids state carried by colour
          alone, and this is the state the parent most needs to read correctly. */}
      <View style={styles.lockBubble}>
        <Icon name={IconName.lock} size={22} color="warningDeep" />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.explanation}>{explanation}</Text>

      <View style={styles.action}>
        {status === 'denied' && (
          <Button label={strings.permissions.tryAgain} onPress={onRetry} />
        )}

        {status === 'blocked' && (
          <Button label={strings.permissions.openSettings} onPress={onOpenSettings} />
        )}
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
  lockBubble: {
    width: spacing.xxxl,
    height: spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.warningMuted,
    marginTop: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
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
