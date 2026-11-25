import React, { useState, forwardRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { inputMetrics } from '../foundations';
import { IconReview, IconHide } from '@yoroll/rn-icon';

export interface YTextInputProps extends Omit<TextInputProps, 'style'> {
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  /** Show eye toggle for password fields. Sets secureTextEntry under the hood. */
  password?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
  error?: string | null;
  hint?: string;
  style?: StyleProp<ViewStyle>;
}

export const YTextInput = forwardRef<TextInput, YTextInputProps>(function YTextInput(
  { leftIcon, rightSlot, password, showPasswordLabel = 'Show password', hidePasswordLabel = 'Hide password', error, hint, style, ...rest },
  ref,
) {
  const { tokens, fonts, mode } = useTheme();
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = !!password;
  const secure = isPassword ? !visible : !!rest.secureTextEntry;

  // Glass surface — same recipe as Home/Membership cards.
  const glassBg =
    mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
  const glassBorder =
    mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)';

  const borderColor = error
    ? tokens.textWrong
    : focused
      ? tokens.textPrimary
      : glassBorder;

  return (
    <View style={style}>
      <View
        style={[
          styles.field,
          {
            backgroundColor: glassBg,
            borderColor,
          },
        ]}
      >
        {leftIcon ? <View style={styles.leftIconWrap}>{leftIcon}</View> : null}
        <TextInput
          ref={ref}
          {...rest}
          secureTextEntry={secure}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={tokens.textTertiary ?? tokens.textSecondary}
          style={[
            styles.input,
            {
              color: tokens.textPrimary,
              fontFamily: fonts.sans,
            },
          ]}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={visible ? hidePasswordLabel : showPasswordLabel}
            style={styles.rightWrap}
          >
            {visible ? (
              <IconHide size={16} color={tokens.textSecondary} />
            ) : (
              <IconReview size={16} color={tokens.textSecondary} />
            )}
          </Pressable>
        ) : null}
        {rightSlot ? <View style={styles.rightWrap}>{rightSlot}</View> : null}
      </View>
      {error ? (
        <Text style={[styles.helper, { color: tokens.textWrong, fontFamily: fonts.sans }]}>
          {error}
        </Text>
      ) : hint ? (
        <Text
          style={[styles.helper, { color: tokens.textSecondary, fontFamily: fonts.sans }]}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: inputMetrics.borderRadius,
    borderWidth: 1,
    paddingHorizontal: inputMetrics.paddingHorizontal,
    minHeight: inputMetrics.minHeight,
  },
  leftIconWrap: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: inputMetrics.fontSize,
    paddingVertical: inputMetrics.paddingVertical,
    includeFontPadding: false,
  },
  rightWrap: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    fontSize: inputMetrics.helperFontSize,
    marginTop: 6,
    marginLeft: 4,
  },
});
