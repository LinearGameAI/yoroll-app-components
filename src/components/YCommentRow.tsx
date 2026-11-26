import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { componentText, typography } from '../typography';
import { YAvatar } from './YAvatar';

export interface YCommentRowProps {
  name: string;
  message: string;
  avatar?: string;
  timestamp?: string;
  actions?: ReactNode;
  replies?: ReactNode;
}
export function YCommentRow({ name, message, avatar, timestamp, actions, replies }: YCommentRowProps) {
  const { tokens } = useTheme();
  return (
    <View style={styles.row}>
      <YAvatar name={name} src={avatar} size={32} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={[typography.profileLabel, { color: tokens.textPrimary }]}>{name}</Text>
          {timestamp && <Text style={[componentText.rowMeta, { color: tokens.textTertiary }]}>{timestamp}</Text>}
        </View>
        <Text style={[typography.profileDetail, { color: tokens.textSecondary }]}>{message}</Text>
        {actions && <View style={styles.header}>{actions}</View>}
        {replies && <View style={styles.thread}>{replies}</View>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, paddingVertical: 6 },
  body: { flex: 1, minWidth: 0, gap: 4 },
  header: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  thread: { marginTop: 4 },
});
