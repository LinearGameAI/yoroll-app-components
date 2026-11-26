import type { ComponentType } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { controlMetrics } from '../foundations';
import { useTheme } from '../theme';

type NavIcon = ComponentType<{ size: number; color: string }>;
export interface YBottomNavItem {
  key: string;
  label: string;
  icon: NavIcon;
  activeIcon?: NavIcon;
  iconSize?: number;
  unread?: boolean;
}
export interface YBottomNavProps {
  items: readonly YBottomNavItem[];
  active: string;
  onChange: (key: string) => void;
  safeArea?: boolean;
}

export function YBottomNav({ items, active, onChange, safeArea = true }: YBottomNavProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const metrics = controlMetrics.bottomNav;
  const android = Platform.OS === 'android';
  const inset = safeArea ? insets.bottom : 0;
  return (
    <View accessibilityRole="tablist" style={[styles.bar, {
      minHeight: (android ? metrics.androidHeight : metrics.defaultHeight) + inset,
      paddingTop: android ? metrics.androidInset : metrics.defaultTop,
      paddingBottom: (android ? metrics.androidInset : 0) + inset,
      backgroundColor: tokens.tabBarBg, borderTopColor: tokens.cardStroke,
    }]}>
      {items.map(({ key, label, icon, activeIcon, iconSize, unread }) => {
        const selected = key === active;
        const Icon = selected && activeIcon ? activeIcon : icon;
        const color = selected ? tokens.textPrimary : tokens.textTertiary;
        return (
          <Pressable key={key} accessibilityRole="tab" accessibilityState={{ selected }} aria-selected={selected} accessibilityLabel={label}
            onPress={() => onChange(key)} style={({ pressed }) => [styles.item, { opacity: pressed ? 0.65 : 1 }]}>
            <View>
              <Icon size={iconSize ?? metrics.icon} color={color} />
              {unread && <View style={[styles.dot, { backgroundColor: tokens.textWrong }]} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth },
  item: { flex: 1, minWidth: 0, minHeight: 44, alignItems: 'center', justifyContent: 'center', gap: 2 },
  dot: { position: 'absolute', top: 0, right: -4, width: 7, height: 7, borderRadius: 4 },
});
