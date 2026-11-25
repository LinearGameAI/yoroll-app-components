import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  type ColorValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientLabel } from './GradientLabel';
import { useTheme } from '../theme';

export type YButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'brand'
  | 'orange';

export type YButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export interface YButtonGradient {
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  locations?: readonly [number, number, ...number[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export interface YButtonProps {
  testID?: string;
  accessibilityLabel?: string;
  label?: string;
  children?: React.ReactNode;
  variant?: YButtonVariant;
  size?: YButtonSize;
  fullWidth?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /** 可选渐变底色；保留组件原有的尺寸、禁用和按压反馈。 */
  backgroundGradient?: YButtonGradient;
  /** 可选高光渐变，叠在底色上、文字与加载指示器下方。 */
  backgroundHighlightGradient?: YButtonGradient;
  /** 可选渐变文字；仅作用于字符串标签，加载态仍使用原有 spinner。 */
  labelGradient?: YButtonGradient;
}

interface SizeSpec {
  paddingH: number;
  paddingV: number;
  fontSize: number;
  minHeight: number;
  width?: number;
}

const SIZES: Record<YButtonSize, SizeSpec> = {
  sm: { paddingH: 14, paddingV: 10, fontSize: 13, minHeight: 40 },
  md: { paddingH: 16, paddingV: 12, fontSize: 14, minHeight: 44 },
  lg: { paddingH: 18, paddingV: 14, fontSize: 15, minHeight: 48 },
  xl: { paddingH: 22, paddingV: 16, fontSize: 16, minHeight: 56 },
  icon: { paddingH: 0, paddingV: 0, fontSize: 14, minHeight: 40, width: 40 },
};

export function YButton({
  testID,
  accessibilityLabel,
  label,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  onPress,
  disabled,
  loading,
  icon,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  backgroundGradient,
  backgroundHighlightGradient,
  labelGradient,
}: YButtonProps) {
  const { tokens, fontWeights, mode } = useTheme();

  const variants: Record<
    YButtonVariant,
    { background: string; color: string; borderColor: string; borderWidth: number; fontWeight: TextStyle['fontWeight'] }
  > = {
    primary: {
      background: tokens.primary,
      color: mode === 'dark' ? tokens.dark : '#fff',
      borderColor: 'transparent',
      borderWidth: 1,
      fontWeight: '500',
    },
    secondary: {
      background: tokens.bgCard,
      color: tokens.textSecondary,
      borderColor: tokens.cardStroke,
      borderWidth: 1,
      fontWeight: '500',
    },
    outline: {
      background: 'transparent',
      color: tokens.textSecondary,
      borderColor: tokens.cardStroke,
      borderWidth: 1,
      fontWeight: '500',
    },
    ghost: {
      background: 'transparent',
      color: tokens.textSecondary,
      borderColor: 'transparent',
      borderWidth: 1,
      fontWeight: '500',
    },
    danger: { background: '#DC2626', color: '#fff', borderColor: 'transparent', borderWidth: 1, fontWeight: '500' },
    brand: {
      background: tokens.bgPicked,
      color: tokens.orange4,
      borderColor: 'transparent',
      borderWidth: 1,
      fontWeight: '700',
    },
    orange: { background: tokens.orange, color: '#fff', borderColor: 'transparent', borderWidth: 1, fontWeight: '600' },
  };

  const v = variants[variant];
  const s = SIZES[size];
  const isIcon = size === 'icon';

  const content = children ?? label;
  const baseTextStyle: TextStyle = {
    color: v.color,
    fontSize: s.fontSize,
    lineHeight: Math.round(s.fontSize * 1.4),
    fontFamily: fontWeights.sansMedium,
    fontWeight: v.fontWeight,
    flexShrink: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  };
  const labelTextStyle: StyleProp<TextStyle> = [baseTextStyle, textStyle];

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof content === 'string' ? content : undefined)}
      accessibilityState={{ busy: loading, disabled: disabled || loading }}
      aria-busy={loading}
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: backgroundGradient ? 'transparent' : v.background,
          borderColor: v.borderColor,
          borderWidth: v.borderWidth,
          minHeight: s.minHeight,
          paddingHorizontal: isIcon ? 0 : s.paddingH,
          paddingVertical: isIcon ? 0 : s.paddingV,
          width: isIcon ? s.width : fullWidth ? '100%' : undefined,
          alignSelf: fullWidth ? 'stretch' : 'center',
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {backgroundGradient ? (
        <LinearGradient
          pointerEvents="none"
          colors={backgroundGradient.colors}
          locations={backgroundGradient.locations}
          start={backgroundGradient.start}
          end={backgroundGradient.end}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {backgroundHighlightGradient ? (
        <LinearGradient
          pointerEvents="none"
          colors={backgroundHighlightGradient.colors}
          locations={backgroundHighlightGradient.locations}
          start={backgroundHighlightGradient.start}
          end={backgroundHighlightGradient.end}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {loading ? (
        <ActivityIndicator size="small" color={StyleSheet.flatten(textStyle)?.color ?? v.color} />
      ) : (
        <View style={styles.row}>
          {leftIcon ? <View style={styles.iconWrap}>{leftIcon}</View> : null}
          {icon && !leftIcon && !rightIcon && !content ? <View style={styles.iconWrap}>{icon}</View> : null}
          {labelGradient && typeof content === 'string' ? (
            <GradientLabel gradient={labelGradient} style={labelTextStyle}>
              {content}
            </GradientLabel>
          ) : React.isValidElement(content) ? (
            content
          ) : content != null && content !== '' ? (
            <Text
              style={labelTextStyle}
              numberOfLines={1}
            >
              {content}
            </Text>
          ) : null}
          {rightIcon ? <View style={styles.iconWrap}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  row: {
    position: 'relative',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
