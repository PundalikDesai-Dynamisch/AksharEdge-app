import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { MIN_TOUCH_TARGET } from '@/constants/config';
import { strings } from '@/constants/strings';
import { colors, IconName, radii, spacing, typography } from '@theme';

import { Icon } from './Icon';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = strings.common.search,
  onClear,
}: SearchBarProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Icon name={IconName.search} size={18} color="textMuted" />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />

      {value.length > 0 && onClear !== undefined && (
        <Pressable
          onPress={onClear}
          hitSlop={spacing.md}
          accessibilityRole="button"
          accessibilityLabel={strings.accessibility.clearSearchField}
        >
          <Icon name={IconName.x} size={18} color="textMuted" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
});
