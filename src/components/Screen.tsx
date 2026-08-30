import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@theme';

import { Loader } from './Loader';

interface ScreenProps {
  children?: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Set when a navigator already draws a header, so the top inset is not applied twice. */
  edges?: { top?: boolean; bottom?: boolean };
}

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

  if (loading) {
    return (
      <View style={[...frame, styles.centred]}>
        <Loader />
      </View>
    );
  }

  if (scroll) {
    return (
      <View style={frame}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh === undefined ? undefined : (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            )
          }
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return <View style={[...frame, contentStyle]}>{children}</View>;
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: colors.background,
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
});
