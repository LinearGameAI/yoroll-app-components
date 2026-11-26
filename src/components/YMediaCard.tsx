import type { ReactNode } from 'react';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { companionCardStyles as character, homeFeedStyles as feed, profileContentStyles } from '../appStyles';
import { cardMetrics } from '../foundations';
import { useTheme } from '../theme';
import { componentText } from '../typography';

export type YMediaCardVariant = 'game' | 'channel' | 'discover' | 'character' | 'chat' | 'profile' | 'drama' | 'banner' | 'home-feed';
export interface YMediaCardProps {
  title: string;
  subtitle?: string;
  cover?: ImageSource | string;
  gradient?: readonly [string, string, ...string[]];
  badge?: ReactNode;
  coverAction?: ReactNode;
  coverTrailing?: ReactNode;
  tags?: readonly string[];
  variant?: YMediaCardVariant;
  size?: keyof typeof cardMetrics.game.heights;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}
const portraitVariants = new Set<YMediaCardVariant>(['discover', 'character', 'chat']);
const posterScrim = ['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.75)'] as const;
const characterScrim = ['transparent', 'rgba(0,0,0,0.46)', 'rgba(0,0,0,0.89)'] as const;

export function YMediaCard({
  title, subtitle, cover, gradient, badge, coverAction, coverTrailing, tags = [], variant = 'game', size = 'md', onPress, style,
}: YMediaCardProps) {
  const { tokens, fonts } = useTheme();
  const channel = variant === 'channel';
  const profile = variant === 'profile';
  const home = variant === 'home-feed';
  const game = variant === 'game';
  const discover = variant === 'discover';
  const characterPoster = portraitVariants.has(variant);
  const dimensions = channel ? styles.channelCover : profile ? profileContentStyles.cover : home ? feed.feedCover : game
    ? { height: cardMetrics.game.heights[size], borderRadius: cardMetrics.game.radius }
    : characterPoster ? [character.card, discover && character.discoverCard, variant === 'chat' && styles.chatCover]
    : variant === 'drama' ? styles.dramaCover : styles.bannerCover;

  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined} onPress={onPress}
      style={({ pressed }) => [styles.root, channel && styles.channel, pressed && { opacity: 0.85 }, style]}>
      <View style={[styles.cover, dimensions, { backgroundColor: tokens.bgTertiary }]}>
        {gradient && <LinearGradient pointerEvents="none" colors={gradient} style={StyleSheet.absoluteFill} />}
        {cover ? <Image source={cover} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={characterPoster ? 'top' : 'center'} />
          : characterPoster && !gradient && <View style={[StyleSheet.absoluteFill, character.fallback]}>
            <Text style={[character.fallbackText, { color: tokens.textTertiary }]}>{Array.from(title)[0]}</Text>
          </View>}
        {badge && <View style={[styles.badge, home && styles.homeBadge]}>{badge}</View>}
        {coverTrailing && <View style={character.headerBadges}>{coverTrailing}</View>}
        {characterPoster && <>
          <LinearGradient colors={characterScrim} locations={[0, 0.42, 1]} style={styles.characterScrim} />
          <View style={character.copy}>
            <Text numberOfLines={1} style={[character.name, discover && character.discoverName, { fontFamily: fonts.sans }]}>{title}</Text>
            {!!tags.length && <View style={character.tags}>
              {tags.slice(0, 4).map((tag, index) => <View key={tag + index} style={character.tag}><Text numberOfLines={1} style={character.tagText}>{tag}</Text></View>)}
            </View>}
            {subtitle && <Text numberOfLines={discover ? 3 : 2} style={[character.tagline, character.taglineLineHeight]}>{subtitle}</Text>}
          </View>
        </>}
        {!characterPoster && !channel && !profile && !home && <LinearGradient colors={posterScrim} locations={[0, 0.4, 1]} style={styles.overlay}>
          <Text numberOfLines={2} style={[componentText.mediaTitle, styles.onImage]}>{title}</Text>
          {subtitle && <Text numberOfLines={1} style={[componentText.mediaMeta, styles.dimImage]}>{subtitle}</Text>}
        </LinearGradient>}
        {coverAction && <View style={styles.coverAction}>{coverAction}</View>}
      </View>
      {(channel || profile || home) && <View style={[styles.copy, channel && styles.channelCopy, home && styles.homeCopy]}>
        {channel && subtitle && <Text numberOfLines={1} style={[componentText.channelMeta, { color: tokens.textSecondary }]}>{subtitle}</Text>}
        <Text numberOfLines={home ? 1 : 2} style={[
          channel ? componentText.channelTitle : home ? feed.feedTitle : profileContentStyles.title,
          { color: home ? tokens.textSecondary : tokens.textPrimary, fontFamily: fonts.sans },
        ]}>{title}</Text>
        {(profile || home) && subtitle && <Text numberOfLines={1}
          style={[home ? feed.feedMetaText : profileContentStyles.subtitle, { color: tokens.textTertiary }]}>{subtitle}</Text>}
      </View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { gap: 4, minWidth: 0 },
  cover: { position: 'relative', overflow: 'hidden' },
  channel: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  channelCover: { width: cardMetrics.channel.width, height: cardMetrics.channel.height, borderRadius: cardMetrics.channel.radius },
  chatCover: { aspectRatio: cardMetrics.cover.chatAspect },
  dramaCover: { aspectRatio: 9 / 16, borderRadius: cardMetrics.cover.radius },
  bannerCover: { aspectRatio: 16 / 9, borderRadius: 16 },
  badge: { position: 'absolute', top: 8, left: 8, zIndex: 1 },
  homeBadge: { top: 10, left: 10 },
  overlay: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 32, paddingBottom: 10, paddingHorizontal: 12, gap: 3 },
  characterScrim: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '61%' },
  coverAction: { position: 'absolute', right: 18, bottom: 18, zIndex: 2 },
  copy: { minWidth: 0, gap: 2 },
  homeCopy: { paddingHorizontal: 4, paddingTop: 2 },
  channelCopy: { flex: 1, minHeight: cardMetrics.channel.height, justifyContent: 'center', gap: 4 },
  onImage: { color: '#FFFFFF' },
  dimImage: { color: 'rgba(255,255,255,0.75)' },
});
