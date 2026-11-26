import React from 'react';
import { Pressable, Text, View, StyleSheet, Platform, type ViewStyle, type StyleProp } from 'react-native';
import { playPillLabelTypography } from '../typography';
import { useTheme } from '../theme';
import { IconPlayFilled } from '@yoroll/rn-icon';

export type YPlayPillVariant = 'light' | 'brand';
export type YPlayPillSize = 'sm' | 'md' | 'lg';
export type YPlayPillMode = 'play' | 'continue';

export interface YPlayPillProps {
  label?: string;
  mode?: YPlayPillMode;
  variant?: YPlayPillVariant;
  size?: YPlayPillSize;
  fullWidth?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: (props: { color: string; size: number }) => React.ReactNode;
  iconPosition?: 'left' | 'right';
  hideIcon?: boolean;
  disabled?: boolean;
  /** When true: shows "Coming Soon" label, hides the icon, dims the pill,
   *  and suppresses the tap. */
  comingSoon?: boolean;
  comingSoonLabel?: string;
}

interface SizeSpec {
  padY: number;
  padX: number;
  icon: number;
  gap: number;
}

const SIZES: Record<YPlayPillSize, SizeSpec> = {
  sm: { padY: 6, padX: 12, icon: 11, gap: 6 },
  md: { padY: 9, padX: 16, icon: 13, gap: 6 },
  lg: { padY: 16, padX: 20, icon: 18, gap: 10 },
};

export function YPlayPill({
  label,
  mode = 'play',
  variant = 'light',
  size = 'md',
  fullWidth = false,
  onPress,
  style,
  icon,
  iconPosition = 'left',
  hideIcon = false,
  disabled = false,
  comingSoon = false,
  comingSoonLabel = 'Coming soon',
}: YPlayPillProps) {
  const { fontWeights, mode: themeMode, tokens } = useTheme();
  const s = SIZES[size];
  const v =
    variant === 'brand'
      ? {
          background: themeMode === 'light' ? tokens.dark : '#FFFFFF',
          color: themeMode === 'light' ? '#FFFFFF' : tokens.dark,
        }
      : {
          background: '#FFFFFF',
          color: '#111111',
        };

  // Shadow approximations
  const shadow: ViewStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: size === 'lg' ? 6 : 3 },
      shadowOpacity: 0.18,
      shadowRadius: size === 'lg' ? 16 : 8,
    },
    android: { elevation: 3 },
    default: {},
  }) as ViewStyle;

  const baseLabel = label ?? (mode === 'continue' ? 'Continue' : 'Play');
  const displayLabel = comingSoon ? comingSoonLabel : baseLabel;
  const showLabel = displayLabel.length > 0;
  const iconNode =
    !comingSoon && !hideIcon
      ? icon?.({ color: v.color, size: s.icon }) ?? <IconPlayFilled size={s.icon} color={v.color} />
      : null;
  const textNode = showLabel ? (
    <Text
      style={{
        color: v.color,
        fontFamily: fontWeights.sansBold,
        ...playPillLabelTypography(size),
      }}
    >
      {displayLabel}
    </Text>
  ) : null;

  return (
    <Pressable
      onPress={comingSoon || disabled ? undefined : onPress}
      disabled={comingSoon || disabled || !onPress}
      accessibilityRole="button"
      accessibilityLabel={displayLabel}
      accessibilityState={{ disabled: comingSoon || disabled || !onPress }}
      style={({ pressed }) => [
        styles.base,
        {
          paddingVertical: s.padY,
          paddingHorizontal: s.padX,
          backgroundColor: v.background,
          gap: showLabel ? s.gap : 0,
          width: fullWidth ? '100%' : undefined,
          opacity: comingSoon || disabled || !onPress ? 0.5 : pressed ? 0.85 : 1,
        },
        variant === 'brand' ? null : shadow,
        style,
      ]}
    >
      {iconPosition === 'left' ? iconNode : null}
      {textNode}
      {iconPosition === 'right' ? iconNode : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unusedView = View;
