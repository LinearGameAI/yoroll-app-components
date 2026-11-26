import type { ReactNode } from 'react';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { layout } from '../foundations';
import { useTheme } from '../theme';
import { componentText, typography } from '../typography';
import { SkeletonBlock } from './SkeletonBlock';
import { YAvatar } from './YAvatar';

export interface YProfileHeaderProps {
  name: string;
  avatar?: string;
  cover?: ImageSource | string;
  subtitle?: string;
  bio?: string;
  badge?: ReactNode;
  action?: ReactNode;
  stats?: readonly { id: string; label: string; value: string; onPress?: () => void }[];
  loading?: boolean;
}
export function YProfileHeader({ name, avatar, cover, subtitle, bio, badge, action, stats, loading }: YProfileHeaderProps) {
  const { tokens } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: tokens.bgPrimary }]}>
      {cover && <View pointerEvents="none" style={styles.cover}>
        <Image source={cover} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={[tokens.bottomGradientStart, tokens.bottomGradientStop]} style={StyleSheet.absoluteFill} />
      </View>}
      <View style={[styles.row, cover && styles.withCover]}>
        {loading ? <SkeletonBlock style={styles.avatar} /> : <YAvatar src={avatar} name={name} size={90} />}
        <View style={styles.copy}>
          {loading ? <><SkeletonBlock style={styles.nameSkeleton} /><SkeletonBlock style={styles.subtitleSkeleton} /></> : <>
            <View style={styles.identity}>
              <Text style={[componentText.profileName, styles.name, { color: tokens.textPrimary }]}>{name}</Text>{badge}
            </View>
            {subtitle && <Text style={[componentText.profileCaption, { color: tokens.textSecondary }]}>{subtitle}</Text>}
          </>}
        </View>
        {action}
      </View>
      {!loading && bio && <Text style={[typography.profileDetail, { color: tokens.textSecondary }]}>{bio}</Text>}
      {!loading && !!stats?.length && <View style={styles.stats}>
        {stats.map(({ id, label, value, onPress }) => <Text key={id} onPress={onPress} accessibilityRole={onPress ? 'button' : undefined}
          style={[componentText.profileCaption, styles.stat, { color: tokens.textSecondary }]}>
          <Text style={[typography.profileLabel, { color: tokens.textPrimary }]}>{value}</Text>{' '}{label}
        </Text>)}
      </View>}
    </View>
  );
}
const styles = StyleSheet.create({
  root: { position: 'relative', paddingHorizontal: layout.gutter, paddingTop: 12, paddingBottom: 24, gap: 12, overflow: 'hidden' },
  cover: { position: 'absolute', top: 0, right: 0, left: 0, height: 156 },
  withCover: { paddingTop: 52 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  copy: { flex: 1, minWidth: 0, gap: 6 },
  identity: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  name: { flexShrink: 1 },
  nameSkeleton: { width: 120, maxWidth: '100%', height: 24, borderRadius: 4 },
  subtitleSkeleton: { width: 96, maxWidth: '100%', height: 14, borderRadius: 4 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 14 },
  stat: { minHeight: 36, textAlignVertical: 'center', paddingVertical: 8 },
});
