import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, spacing } from '@theme';

import { Loader } from './Loader';

interface ScreenProps {
  children?: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  /**
   * design.md §11 keeps the parent area calm and §13 lets the child area be playful. `playful`
   * adds the §5 organic accent shapes behind the content; `plain` is the default so no existing
   * screen changes appearance.
   */
  variant?: 'plain' | 'playful';
  /** Set when a navigator already draws a header, so the top inset is not applied twice. */
  edges?: { top?: boolean; bottom?: boolean };
}

/**
 * Decorative background shapes, sized in absolute points rather than on the 4px spacing scale:
 * they are artwork bleeding off the edges, not layout, so the scale does not apply to them.
 */
const BLOB = { top: 220, bottom: 260 } as const;

/**
 * Every screen's root element. It owns safe-area insets and the background colour so no
 * screen hand-rolls either (doc 18 §3).
 */
export function Screen({
  children,
  scroll = false,
  padded = true,
  loading = false,
  refreshing = false,
  onRefresh,
  variant = 'plain',
  edges,
}: ScreenProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const applyTop = edges?.top ?? true;
  const applyBottom = edges?.bottom ?? true;

  const frame = [
    styles.frame,
    { paddingTop: applyTop ? insets.top : 0, paddingBottom: applyBottom ? insets.bottom : 0 },
  ];
  const contentStyle = padded ? styles.padded : undefined;

  // Rendered before the content and never interactive, so a blob can never swallow a tap.
  const backdrop =
    variant === 'playful' ? (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.blob, styles.blobTop]} />
        <View style={[styles.blob, styles.blobBottom]} />
      </View>
    ) : null;

  if (loading) {
    return (
      <View style={frame}>
        {backdrop}
        <View style={[styles.fill, styles.centred]}>
          <Loader />
        </View>
      </View>
    );
  }

  if (scroll) {
    return (
      <View style={frame}>
        {backdrop}
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh === undefined ? undefined : (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primaryDeep}
              />
            )
          }
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={frame}>
      {backdrop}
      <View style={[styles.fill, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // The content sits in its own filling child so the backdrop can bleed to the frame's edges
  // instead of being inset by the content padding.
  fill: {
    flex: 1,
  },
  centred: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: spacing.lg,
  },
  blob: {
    position: 'absolute',
    borderRadius: radii.pill,
  },
  blobTop: {
    width: BLOB.top,
    height: BLOB.top,
    top: -BLOB.top / 2,
    right: -BLOB.top / 3,
    backgroundColor: colors.accentMuted,
  },
  blobBottom: {
    width: BLOB.bottom,
    height: BLOB.bottom,
    bottom: -BLOB.bottom / 2,
    left: -BLOB.bottom / 3,
    backgroundColor: colors.secondaryMuted,
  },
});
