import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { KeyboardTypeOptions, ReturnKeyTypeOptions } from 'react-native';

import { MIN_TOUCH_TARGET } from '@/constants/config';
import { strings } from '@/constants/strings';
import { colors, IconName, radii, spacing, typography } from '@theme';

import { Icon } from './Icon';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  helperText?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words';
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  multiline?: boolean;
  maxLength?: number;
  editable?: boolean;
  placeholder?: string;
  autoComplete?: 'email' | 'password' | 'name' | 'off';
}

export function TextField({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  helperText,
  secure = false,
  keyboardType,
  autoCapitalize = 'sentences',
  returnKeyType,
  onSubmitEditing,
  multiline = false,
  maxLength,
  editable = true,
  placeholder,
  autoComplete,
}: TextFieldProps): React.JSX.Element {
  const [isRevealed, setIsRevealed] = useState(false);
  const hasError = error !== undefined && error.length > 0;

  const handleToggleReveal = useCallback(() => {
    setIsRevealed(current => !current);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputRow,
          hasError && styles.inputRowError,
          !editable && styles.inputRowDisabled,
          multiline && styles.inputRowMultiline,
        ]}
      >
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secure && !isRevealed}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          multiline={multiline}
          maxLength={maxLength}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          autoComplete={autoComplete}
          accessibilityLabel={label}
          accessibilityState={{ disabled: !editable }}
        />

        {secure && (
          <Pressable
            onPress={handleToggleReveal}
            hitSlop={spacing.md}
            accessibilityRole="button"
            accessibilityLabel={
              isRevealed ? strings.accessibility.hidePassword : strings.accessibility.showPassword
            }
            style={styles.trailingAction}
          >
            <Icon name={isRevealed ? IconName.eyeOff : IconName.eye} size={18} color="textMuted" />
          </Pressable>
        )}
      </View>

      {hasError ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <Icon name={IconName.alertCircle} size={14} color="danger" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        helperText !== undefined && <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    minHeight: MIN_TOUCH_TARGET * 2,
  },
  inputRowError: {
    borderColor: colors.danger,
  },
  inputRowDisabled: {
    backgroundColor: colors.background,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  trailingAction: {
    paddingLeft: spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    flexShrink: 1,
  },
  helperText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
