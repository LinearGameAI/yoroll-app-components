import type { ReactNode } from 'react';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { cardMetrics } from '../foundations';
import { useTheme } from '../theme';
import { componentText } from '../typography';

export type YMediaCardVariant = 'game' | 'channel' | 'discover' | 'character' | 'chat' | 'profile' | 'drama' | 'banner';
export interface YMediaCardProps {
  title: string;
  subtitle?: string;
  cover?: ImageSource | string;
  gradient?: readonly [string, string, ...string[]];
  badge?: ReactNode;
  tags?: readonly string[];
  variant?: YMediaCardVariant;
  size?: keyof typeof cardMetrics.game.heights;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}
const aspectRatios = {
  discover: cardMetrics.cover.discoverAspect, character: cardMetrics.cover.characterAspect,
  chat: cardMetrics.cover.chatAspect, profile: cardMetrics.cover.profileAspect, drama: 9 / 16, banner: 16 / 9,
};
const posterScrim = ['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.75)'] as const;

export function YMediaCard({
  title, subtitle, cover, gradient, badge, tags = [], variant = 'game', size = 'md', onPress, style,
}: YMediaCardProps) {
  const { tokens } = useTheme();
  const channel = variant === 'channel';
  const profile = variant === 'profile';
  const game = variant === 'game';
  const textStyle = channel ? componentText.channelTitle : game ? componentText.mediaTitle
    : variant === 'discover' ? componentText.coverSmallTitle : componentText.coverTitle;
  const coverStyle = channel ? styles.channelCover : game
    ? { height: cardMetrics.game.heights[size], borderRadius: cardMetrics.game.radius }
    : { aspectRatio: aspectRatios[variant], borderRadius: cardMetrics.cover.radius };
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined} onPress={onPress}
      style={({ pressed }) => [styles.root, channel && styles.channel, pressed && { opacity: 0.85 }, style]}>
      <View style={[styles.cover, coverStyle, { backgroundColor: tokens.bgTertiary }]}>
        {gradient && <LinearGradient pointerEvents="none" colors={gradient} style={StyleSheet.absoluteFill} />}
        {cover && <Image source={cover} style={StyleSheet.absoluteFill} contentFit="cover" />}
        {badge && <View style={styles.badge}>{badge}</View>}
        {!channel && !profile && <LinearGradient colors={posterScrim} locations={[0, 0.4, 1]} style={styles.overlay}>
          <Text numberOfLines={2} style={[textStyle, styles.onImage]}>{title}</Text>
          {subtitle && <Text numberOfLines={1} style={[componentText.mediaMeta, styles.dimImage]}>{subtitle}</Text>}
          {!!tags.length && <View style={styles.tags}>
            {tags.slice(0, 4).map((tag, index) => <Text numberOfLines={1} key={tag + index} style={styles.tag}>{tag}</Text>)}
          </View>}
        </LinearGradient>}
      </View>
      {(channel || profile) && <View style={[styles.copy, channel && styles.channelCopy]}>
        {channel && subtitle && <Text numberOfLines={1} style={[componentText.channelMeta, { color: tokens.textSecondary }]}>{subtitle}</Text>}
        <Text numberOfLines={2} style={[textStyle, { color: tokens.textPrimary }]}>{title}</Text>
        {profile && subtitle && <Text numberOfLines={1} style={[componentText.modelBody, { color: tokens.textSecondary }]}>{subtitle}</Text>}
      </View>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  root: { gap: 4, minWidth: 0 },
  cover: { position: 'relative', overflow: 'hidden' },
  channel: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  channelCover: { width: cardMetrics.channel.width, height: cardMetrics.channel.height, borderRadius: cardMetrics.channel.radius },
  badge: { position: 'absolute', top: 8, left: 8, zIndex: 1 },
  overlay: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 32, paddingBottom: 10, paddingHorizontal: 10, gap: 3 },
  copy: { minWidth: 0, gap: 2 },
  channelCopy: { flex: 1, minHeight: cardMetrics.channel.height, justifyContent: 'center', gap: 4 },
  onImage: { color: '#FFFFFF' },
  dimImage: { color: 'rgba(255,255,255,0.75)' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 },
  tag: { ...componentText.coverTag, color: 'rgba(255,255,255,0.88)', borderRadius: 4, overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.50)', paddingHorizontal: 5, paddingVertical: 2 },
});
