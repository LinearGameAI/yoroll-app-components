import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { nativeInboxStyles as s } from '../appStyles';
import { useTheme } from '../theme';
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
export function YInboxRow({ title, preview, timestamp, avatar, leading, trailing, unread, unreadLabel = 'Unread', onPress, onLongPress }: YInboxRowProps) {
  const { tokens, fonts } = useTheme();
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={[title, preview, timestamp, unread ? unreadLabel : undefined].filter(Boolean).join(', ')}
      onPress={onPress} onLongPress={onLongPress} style={({ pressed }) => [s.row, { opacity: pressed ? 0.65 : 1 }]}>
      <View style={s.avatarWrap}>{leading ?? <YAvatar name={title} src={avatar} size={s.avatarWrap.width} />}</View>
      <View style={[s.rowBody, { borderBottomColor: tokens.cardStroke }]}>
        <View style={s.rowHeader}>
          <Text numberOfLines={1} style={[s.rowName, { color: tokens.textPrimary, fontFamily: fonts.sans }]}>{title}</Text>
          {timestamp && <Text style={[s.rowTime, { color: tokens.textTertiary, fontFamily: fonts.sans }]}>{timestamp}</Text>}
        </View>
        <View style={s.rowHeader}>
          <Text numberOfLines={1} style={[s.rowPreview, { color: tokens.textSecondary, fontFamily: fonts.sans }]}>{preview}</Text>
          {unread && <View style={[s.unreadDot, { backgroundColor: tokens.textWrong }]} />}
          {trailing}
        </View>
      </View>
    </Pressable>
  );
}
