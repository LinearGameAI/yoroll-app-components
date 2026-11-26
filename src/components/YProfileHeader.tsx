import type { ReactNode } from 'react';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { profileIdentityStyles as s } from '../appStyles';
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
  subtitleAction?: ReactNode;
  onAvatarPress?: () => void;
  avatarLabel?: string;
  stats?: readonly { id: string; label: string; value: string; onPress?: () => void }[];
  loading?: boolean;
}

export function YProfileHeader({
  name, avatar, cover, subtitle, bio, badge, action, subtitleAction, stats, loading, onAvatarPress, avatarLabel,
}: YProfileHeaderProps) {
  const { tokens, fonts, mode } = useTheme();
  const avatarNode = loading ? <SkeletonBlock style={s.avatarSkeleton} /> :
    <YAvatar src={avatar} name={name} size={s.avatar.width} gradientColors={avatar ? undefined : [tokens.orange, tokens.orange7]} />;
  return (
    <View style={styles.root}>
      {cover && <View pointerEvents="none" style={styles.cover}>
        <Image source={cover} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" />
        <LinearGradient colors={[tokens.bottomGradientStart, tokens.bottomGradientStop]} locations={[0, 1]} style={styles.fade} />
      </View>}
      <View style={[s.identity, cover && s.coverOverlap]}>
        <View style={s.identityRow}>
          {onAvatarPress && !loading ? <Pressable accessibilityRole="button" accessibilityLabel={avatarLabel ?? name}
            onPress={onAvatarPress} style={({ pressed }) => [s.avatar, pressed && { opacity: 0.75 }]}>{avatarNode}</Pressable> :
            <View style={s.avatar}>{avatarNode}</View>}
          <View style={s.information}>
            <View style={s.textGroup}>
              <View style={s.nameRow}>
                {loading ? <SkeletonBlock style={s.nameSkeleton} /> :
                  <Text style={[componentText.profileName, styles.name, { color: tokens.textPrimary, fontFamily: fonts.disp }]}>{name}</Text>}
                {badge}
                {action}
              </View>
              {loading ? <SkeletonBlock style={s.subtitleSkeleton} /> : subtitle && <View style={s.subtitleRow}>
                <Text numberOfLines={1} ellipsizeMode="middle" style={[componentText.profileCaption, styles.subtitle,
                  { color: mode === 'dark' ? '#7B7A77' : tokens.textTertiary, fontFamily: fonts.sans }]}>{subtitle}</Text>
                {subtitleAction}
              </View>}
            </View>
          </View>
        </View>
        {!loading && (bio || !!stats?.length) ? <View style={s.details}>
          {bio && <Text style={[typography.profileDetail, { color: tokens.textSecondary }]}>{bio}</Text>}
          {!!stats?.length && <View style={styles.stats}>
            {stats.map(({ id, label, value, onPress }) => <Text key={id} onPress={onPress} accessibilityRole={onPress ? 'button' : undefined}
              style={[componentText.profileCaption, { color: tokens.textTertiary }]}>
              <Text style={[typography.profileLabel, { color: tokens.textPrimary }]}>{value}</Text>{' '}{label}
            </Text>)}
          </View>}
        </View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { overflow: 'hidden' },
  cover: { height: 160, overflow: 'hidden' },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 88 },
  name: { flexShrink: 1, letterSpacing: 0.2 },
  subtitle: { flexShrink: 1 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
