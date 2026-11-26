import type { ReactNode } from 'react';
import { IconCheck, IconPauseFilled, IconPlayFilled } from '@yoroll/rn-icon';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { voiceCardStyles as s } from '../appStyles';
import { useTheme } from '../theme';
import { typography } from '../typography';
import { SkeletonBlock } from './SkeletonBlock';
import { YAvatar } from './YAvatar';

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
  const PlayIcon = playing ? IconPauseFilled : IconPlayFilled;
  return (
    <View style={[s.card, { backgroundColor: selected ? tokens.orange1 : tokens.bgSecondary }, style]}>
      <Pressable accessibilityRole="radio" accessibilityLabel={name} accessibilityState={{ checked: selected, disabled: locked, busy: loading }} aria-checked={Boolean(selected)}
        disabled={locked} onPress={onSelect} style={({ pressed }) => [s.select, pressed && { opacity: 0.8 }]}>
        {loading ? <SkeletonBlock style={s.skeletonAvatar} /> : avatar ?? <YAvatar name={name} size={24} />}
        {loading ? <View style={s.skeletonNameLine}><SkeletonBlock style={s.skeletonName} /></View> :
          <Text style={[typography.creatorHeading, { color: selected ? tokens.orange5 : tokens.textPrimary }]} numberOfLines={2}>{name}</Text>}
        {selected && !loading && <View style={s.check} pointerEvents="none"><IconCheck size={14} color={tokens.orange5} /></View>}
      </Pressable>
      {onPreview && (loading ? <View style={s.preview}><SkeletonBlock style={s.playCircle} /></View> :
        <Pressable accessibilityRole="button" accessibilityState={{ disabled, selected: playing }} onPress={onPreview}
          accessibilityLabel={previewLabel ?? (playing ? 'Stop preview' : 'Preview voice') + ': ' + name}
          disabled={disabled} style={({ pressed }) => [s.preview, pressed && { opacity: 0.7 }]}>
          <View style={[s.playCircle, { backgroundColor: playing ? '#FFFFFF' : 'rgba(255,255,255,0.12)' }]}>
            <PlayIcon size={14} color={playing ? tokens.dark : tokens.textPrimary} />
          </View>
        </Pressable>)}
    </View>
  );
}
