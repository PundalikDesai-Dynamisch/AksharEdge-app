import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MIN_TOUCH_TARGET } from '@/constants/config';
import { strings } from '@/constants/strings';
import { colors, IconName, radii, shadows, spacing, typography } from '@theme';

import type { ColorToken, IconGlyph } from '@theme';

import { Icon } from './Icon';

type TabBarVariant = 'parent' | 'child';

export interface TabItem {
  readonly key: string;
  readonly label: string;
  readonly icon: IconGlyph;
  /** Spec §18 locks Report before completion; §27 locks Play after it. Locked, never hidden. */
  readonly disabled?: boolean;
  /** The "new" dot Report carries once a report lands (spec §27). */
  readonly badge?: boolean;
}

interface BottomTabBarProps {
  variant: TabBarVariant;
  items: readonly TabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}

interface VariantStyle {
  readonly iconSize: number;
  readonly active: ColorToken;
  readonly inactive: ColorToken;
  /** The child bar fills a pill behind the active tab; the parent bar stays flat and adult. */
  readonly highlightActive: boolean;
  readonly rounded: boolean;
}

/**
 * design.md §8.9 wants the two contexts to "feel like the same product" while making it obvious
 * whether you are managing the family or inside a child's journey. The difference is carried by
 * weight and emphasis — icon size, an active pill, a lifted rounded edge — rather than by a
 * different palette, which would read as two different apps.
 */
const VARIANTS: Readonly<Record<TabBarVariant, VariantStyle>> = {
  parent: {
    iconSize: 22,
    active: 'primaryDeep',
    inactive: 'textMuted',
    highlightActive: false,
    rounded: false,
  },
  child: {
    iconSize: 26,
    active: 'primaryDeep',
    inactive: 'textMuted',
    highlightActive: true,
    rounded: true,
  },
};

/**
 * Presentation only — it takes its items, the active key, and a callback.
 *
 * ⚠️ Deliberately NOT the raw React Navigation `BottomTabBarProps` shape: a bar that can only be
 * rendered inside a live navigator cannot be shown in the component gallery or snapshot-tested
 * with literal props, and the gallery is this phase's exit gate. The thin adapter that maps
 * navigation state onto `items` belongs with the navigators themselves, in phase-2/parent-home
 * and phase-4/child-tabs-navigator.
 *
 * Disabled state arrives as a prop. This component must never call `isPlayAvailable` /
 * `isReportAvailable` itself — the eslint presentation boundary blocks it from reaching data at
 * all, and gating that lives in one policy cannot drift between the two tabs.
 */
export function BottomTabBar({
  variant,
  items,
  activeKey,
  onSelect,
}: BottomTabBarProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const tone = VARIANTS[variant];

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.bar,
        tone.rounded && styles.barRounded,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm },
      ]}
    >
      {items.map(item => {
        const isDisabled = item.disabled === true;
        const isActive = item.key === activeKey && !isDisabled;
        const token: ColorToken = isActive ? tone.active : tone.inactive;

        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            disabled={isDisabled}
            accessibilityRole="tab"
            accessibilityLabel={
              isDisabled ? `${item.label}, ${strings.accessibility.tabLocked}` : item.label
            }
            accessibilityState={{ selected: isActive, disabled: isDisabled }}
            style={styles.tab}
          >
            <View
              style={[
                styles.content,
                tone.highlightActive && isActive && styles.contentActive,
              ]}
            >
              <View>
                <Icon name={item.icon} size={tone.iconSize} color={token} />

                {/* A padlock, not just a dimmed colour: design.md §18 forbids state carried by
                    colour alone, and it also says *why* the tab cannot be opened yet. */}
                {isDisabled && (
                  <View style={styles.lock}>
                    <Icon name={IconName.lock} size={10} color="textMuted" />
                  </View>
                )}

                {item.badge === true && !isDisabled && (
                  <View
                    style={styles.badge}
                    accessibilityLabel={strings.accessibility.newResult}
                  />
                )}
              </View>

              <Text style={[styles.label, { color: colors[token] }]} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  barRounded: {
    ...shadows.lg,
    borderTopWidth: 0,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
  tab: {
    flex: 1,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  contentActive: {
    backgroundColor: colors.primaryMuted,
  },
  label: {
    ...typography.caption,
  },
  lock: {
    position: 'absolute',
    right: -8,
    bottom: -4,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -2,
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
