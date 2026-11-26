import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { typography } from '../typography';

export interface YDetailHeaderProps {
  title: string;
  subtitle?: string;
  detail?: string;
  cover?: ImageSource | string;
  artwork?: ReactNode;
  actions?: ReactNode;
  tags?: ReactNode;
  variant?: 'poster' | 'landscape';
}
export function YDetailHeader({ title, subtitle, detail, cover, artwork, actions, tags, variant = 'landscape' }: YDetailHeaderProps) {
  const { tokens } = useTheme();
  return (
    <View style={styles.root}>
      <View style={[styles.hero, { aspectRatio: variant === 'poster' ? 4 / 5 : 16 / 9, backgroundColor: tokens.bgSecondary }]}>
        {cover && <Image source={cover} style={StyleSheet.absoluteFill} contentFit="cover" />}
        {artwork}
        <LinearGradient pointerEvents="none" colors={[tokens.bottomGradientStart, tokens.bottomGradientStop]} style={styles.scrim} />
        {actions && <View style={styles.actions}>{actions}</View>}
      </View>
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={[typography.creatorTitle, { color: tokens.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[typography.profileLabel, { color: tokens.textSecondary }]}>{subtitle}</Text>}
        {tags && <View style={styles.tags}>{tags}</View>}
        {detail && <Text style={[typography.creatorBody, { color: tokens.textSecondary }]}>{detail}</Text>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { gap: 6 },
  hero: { position: 'relative', overflow: 'hidden', borderRadius: 12 },
  scrim: { position: 'absolute', height: '44%', left: 0, right: 0, bottom: 0 },
  actions: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', gap: 4 },
  copy: { paddingHorizontal: 4, gap: 7 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
});
