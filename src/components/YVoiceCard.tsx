import type { ReactNode } from 'react';
import { IconCheck, IconPauseFilled, IconPlayFilled } from '@yoroll/rn-icon';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { typography } from '../typography';
import { SkeletonBlock } from './SkeletonBlock';
import { YAvatar } from './YAvatar';
import { YIconButton } from './YIconButton';

export interface YVoiceCardProps {
  name: string;
  avatar?: ReactNode;
  selected?: boolean;
  playing?: boolean;
  loading?: boolean;
  disabled?: boolean;
  previewLabel?: string;
  onSelect: () => void;
  onPreview?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function YVoiceCard({ name, avatar, selected, playing, loading, disabled, previewLabel, onSelect, onPreview, style }: YVoiceCardProps) {
  const { tokens } = useTheme();
  const locked = disabled || loading;
  return (
    <View style={[styles.card, { backgroundColor: selected ? tokens.orange1 : tokens.bgSecondary }, style]}>
      <Pressable accessibilityRole="radio" accessibilityLabel={name} accessibilityState={{ checked: selected, disabled: locked, busy: loading }}
        disabled={locked} onPress={onSelect} style={({ pressed }) => [styles.select, { opacity: pressed ? 0.8 : 1 }]}>
        {loading ? <SkeletonBlock style={styles.circleSkeleton} /> : avatar ?? <YAvatar name={name} size={24} />}
        {loading ? <SkeletonBlock style={styles.nameSkeleton} /> :
          <Text style={[typography.creatorHeading, { color: selected ? tokens.orange5 : tokens.textPrimary }]} numberOfLines={2}>{name}</Text>}
        {selected && !loading && <View style={styles.check} pointerEvents="none"><IconCheck size={14} color={tokens.orange5} /></View>}
      </Pressable>
      {!loading && onPreview && <YIconButton icon={playing ? IconPauseFilled : IconPlayFilled} selected={playing}
        label={previewLabel ?? (playing ? 'Stop preview' : 'Preview voice') + ': ' + name}
        disabled={disabled} onPress={onPreview} iconSize={14} color={playing ? tokens.dark : tokens.textPrimary}
        size={28} hitSlop={8} style={[styles.play, { backgroundColor: playing ? '#FFFFFF' : tokens.bgTertiary }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexGrow: 1, minHeight: 112, borderRadius: 16, overflow: 'hidden' },
  select: { flexGrow: 1, minHeight: 112, padding: 12, paddingBottom: 44, gap: 4 },
  check: { position: 'absolute', right: 12, top: 12 },
  play: { position: 'absolute', right: 12, bottom: 12 },
  circleSkeleton: { width: 24, height: 24, borderRadius: 12 },
  nameSkeleton: { width: '65%', height: 14, borderRadius: 7 },
});
