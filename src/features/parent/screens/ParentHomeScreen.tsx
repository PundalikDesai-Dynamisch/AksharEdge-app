import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AVATAR_IDS } from '@assets/registry';
import { Avatar, Mascot, Screen } from '@components';
import { strings } from '@/constants/strings';

import { colors, spacing, typography } from '@theme';

/** Enough avatars to confirm the registry resolves more than one file. */
const PREVIEW_AVATARS = AVATAR_IDS.slice(0, 4);

/**
 * Placeholder so the app stays bootable while the teacher-era screens are gone.
 *
 * It doubles as the visual smoke test for the asset pipeline: if the heading is not in Baloo 2
 * the fonts are not registered, and if the mascot or avatars are missing then react-native-svg
 * is not linked. Both failures are silent otherwise — a font falls back to the system face and
 * an unrendered SVG just leaves a gap.
 *
 * Phase 2 (`phase-2/parent-home`) replaces this entirely with the real two-state Parent Home.
 */
export default function ParentHomeScreen(): React.JSX.Element {
  return (
    <Screen scroll>
      <View style={styles.body}>
        <Mascot pose="waving" size={140} />

        <Text style={styles.title}>{strings.app.name}</Text>
        <Text style={styles.subtitle}>{strings.app.welcomeSubtitle}</Text>

        <View style={styles.avatarRow}>
          {PREVIEW_AVATARS.map(id => (
            <Avatar key={id} avatarId={id} size={56} />
          ))}
        </View>

        <Text style={styles.caption}>
          Heading in Baloo 2, body in Nunito, artwork through the asset registry.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  title: {
    ...typography.displayLarge,
    color: colors.primaryDeep,
  },
  subtitle: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  caption: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
