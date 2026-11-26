import type { ComponentType } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { controlMetrics } from '../foundations';
import { useTheme } from '../theme';

export interface YIconButtonProps {
  icon: ComponentType<{ size: number; color: string }>;
  label: string;
  onPress: () => void;
  variant?: 'plain' | 'surface' | 'media' | 'danger';
  size?: number;
  iconSize?: number;
  hitSlop?: number;
  color?: string;
  selected?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function YIconButton({
  icon: Icon, label, onPress, variant = 'plain', size = controlMetrics.iconButton.target,
  iconSize = controlMetrics.iconButton.icon, hitSlop, color, selected, disabled, style,
}: YIconButtonProps) {
  const { tokens } = useTheme();
  const surface = {
    plain: 'transparent', surface: tokens.bgTertiary, media: 'rgba(255,255,255,0.13)', danger: '#DC2626',
  }[variant];
  const foreground = variant === 'media' || variant === 'danger' ? '#FFFFFF' : tokens.textPrimary;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, selected }}
      onPress={onPress} disabled={disabled} hitSlop={hitSlop} style={({ pressed }) => [
        styles.button, { width: size, height: size, backgroundColor: surface, opacity: disabled ? 0.4 : pressed ? 0.65 : 1 }, style,
      ]}>
      <Icon size={iconSize} color={color ?? foreground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { flexShrink: 0, borderRadius: 999, justifyContent: 'center', alignItems: 'center' },
});
