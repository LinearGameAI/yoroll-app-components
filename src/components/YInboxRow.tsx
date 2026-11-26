import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { controlMetrics, layout } from '../foundations';
import { useTheme } from '../theme';
import { componentText } from '../typography';
import { YAvatar } from './YAvatar';

export interface YInboxRowProps {
  title: string;
  preview: string;
  timestamp?: string;
  avatar?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  unread?: boolean;
  unreadLabel?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}
const metrics = controlMetrics.inboxRow;
export function YInboxRow({ title, preview, timestamp, avatar, leading, trailing, unread, unreadLabel = 'Unread', onPress, onLongPress }: YInboxRowProps) {
  const { tokens } = useTheme();
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={[title, preview, timestamp, unread ? unreadLabel : undefined].filter(Boolean).join(', ')}
      onPress={onPress} onLongPress={onLongPress} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.65 : 1 }]}>
      <View style={styles.avatar}>{leading ?? <YAvatar name={title} src={avatar} size={metrics.avatar} />}</View>
      <View style={[styles.body, { borderBottomColor: tokens.cardStroke }]}>
        <View style={styles.split}>
          <Text numberOfLines={1} style={[componentText.inboxTitle, styles.text, { color: tokens.textPrimary }]}>{title}</Text>
          {timestamp && <Text style={[componentText.rowMeta, { color: tokens.textTertiary }]}>{timestamp}</Text>}
        </View>
        <View style={styles.split}>
          <Text numberOfLines={1} style={[componentText.inboxPreview, styles.text, { color: tokens.textSecondary }]}>{preview}</Text>
          {unread && <View style={[styles.dot, { backgroundColor: tokens.textWrong }]} />}
          {trailing}
        </View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: metrics.rowGap, paddingLeft: layout.gutter },
  avatar: { width: metrics.avatar, height: metrics.avatar, marginVertical: metrics.avatarMargin },
  body: { flex: 1, minWidth: 0, alignSelf: 'stretch', justifyContent: 'center', gap: 4,
    paddingRight: layout.gutter, borderBottomWidth: StyleSheet.hairlineWidth },
  split: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  text: { flexShrink: 1 },
  dot: { width: metrics.unreadDot, height: metrics.unreadDot, borderRadius: metrics.unreadDot / 2 },
});
