import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, type ImageSource } from 'expo-image';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
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
  const { tokens } = useTheme();
  const type = chatMessageTypography(fontSize);
  const user = variant === 'user';
  const plain = variant === 'narration' || variant === 'thought' || variant === 'description';
  const pending = variant === 'pending';
  const color = user ? '#17171A' : onPhoto ? '#F5F5F3' : plain ? tokens.textSecondary : tokens.textPrimary;
  return (
    <View style={[styles.row, user && styles.userRow]}>
      {leading}
      <View style={styles.stack}>
        <View accessibilityState={{ busy: pending }} style={[styles.bubble,
          user ? styles.user : plain ? styles.plain : styles.dialog,
          { backgroundColor: user || plain ? 'transparent' : onPhoto ? 'rgba(255,255,255,0.13)' : tokens.bgSecondary }]}>
          {user && <LinearGradient pointerEvents="none" colors={['#FBD0C0', '#F8ABD7']} style={StyleSheet.absoluteFill} />}
          {variant === 'media' && artwork && <Image source={artwork} contentFit="cover" style={styles.art} />}
          {pending && <ActivityIndicator color={color} />}
          {text && <Text style={[
            variant === 'media' || pending ? type.dialog : type[variant],
            { color, fontStyle: variant === 'thought' ? 'italic' : 'normal', fontWeight: user ? '500' : '400' },
          ]}>{text}</Text>}
        </View>
        {actions && <View style={styles.actions}>{actions}</View>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, alignSelf: 'flex-start', maxWidth: '90%' },
  userRow: { alignSelf: 'flex-end' },
  stack: { flexShrink: 1, minWidth: 0, gap: 6 },
  bubble: { borderRadius: 16, overflow: 'hidden', paddingHorizontal: 13, paddingVertical: 10, gap: 6 },
  user: { borderTopRightRadius: 0 },
  dialog: { borderTopLeftRadius: 0 },
  plain: { paddingHorizontal: 0, paddingVertical: 2 },
  art: { width: 160, maxWidth: '100%', aspectRatio: 9 / 16, borderRadius: 10 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
});
