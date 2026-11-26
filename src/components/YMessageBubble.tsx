import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { chatBubbleStyles as s } from '../appStyles';
import { useTheme } from '../theme';
import { chatMessageTypography } from '../typography';

export interface YMessageBubbleProps {
  variant?: 'user' | 'dialog' | 'narration' | 'thought' | 'description' | 'pending' | 'media';
  text?: string;
  fontSize?: number;
  artwork?: ImageSource | string;
  leading?: ReactNode;
  actions?: ReactNode;
  onPhoto?: boolean;
}
export function YMessageBubble({ variant = 'dialog', text, fontSize, artwork, leading, actions, onPhoto }: YMessageBubbleProps) {
  const { tokens, fonts } = useTheme();
  const type = chatMessageTypography(fontSize);
  const user = variant === 'user';
  const thought = variant === 'thought';
  const plain = variant === 'narration' || thought || variant === 'description';
  const pending = variant === 'pending';
  const secondary = onPhoto ? 'rgba(245,245,243,0.66)' : tokens.textSecondary;
  const color = user ? s.userText.color : plain ? secondary : onPhoto ? '#F5F5F3' : tokens.textPrimary;
  return (
    <View style={[s.dialogRow, styles.row, user && styles.user]}>
      {leading}
      <View style={styles.stack}>
        <View accessibilityState={{ busy: pending }} style={[
          user ? s.userBubble : plain ? styles.plain : [s.dialogBubble, { backgroundColor: onPhoto ? 'rgba(255,255,255,0.13)' : tokens.bgSecondary }],
          user && styles.userWidth,
          thought && [s.thoughtRow, { borderLeftColor: onPhoto ? 'rgba(255,255,255,0.20)' : tokens.cardStroke }],
        ]}>
          {user && <View pointerEvents="none" style={s.userBubbleSurface}>
            <LinearGradient colors={['#FFD7C5', '#F3C5E0', '#D9CBF5']} locations={[0, 0.48, 1]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['rgba(255,255,255,0.38)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
              locations={[0, 0.42, 1]} start={{ x: 0.15, y: 0 }} end={{ x: 0.75, y: 1 }} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.72)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.userBubbleHighlight} />
          </View>}
          {variant === 'media' && artwork && <Image source={artwork} contentFit="cover" style={styles.art} />}
          {pending && <View style={styles.dots}>
            {[0.92, 0.6, 0.38].map((opacity) => <View key={opacity} style={[styles.dot, { backgroundColor: color, opacity }]} />)}
          </View>}
          {text && <Text style={[
            user && s.userText, thought && s.thoughtText, variant === 'media' || pending ? type.dialog : type[variant],
            { color, fontFamily: fonts.sans },
          ]}>{text}</Text>}
        </View>
        {actions && <View style={styles.actions}>{actions}</View>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { alignSelf: 'flex-start', maxWidth: '92%' },
  user: { alignSelf: 'flex-end', maxWidth: '82%' },
  userWidth: { maxWidth: '100%' },
  stack: { flexShrink: 1, minWidth: 0, gap: 6 },
  plain: { paddingVertical: 2 },
  art: { width: 160, maxWidth: '100%', aspectRatio: 9 / 16, borderRadius: 16 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dots: { flexDirection: 'row', minHeight: 15, gap: 4, alignItems: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2 },
});
