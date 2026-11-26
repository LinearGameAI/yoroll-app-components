import type { ReactNode } from 'react';
import { IconPauseFilled, IconPlayFilled, IconShortfullscreen } from '@yoroll/rn-icon';
import { StyleSheet, View } from 'react-native';
import { YorollThemeProvider } from '../theme';
import { YIconButton } from './YIconButton';
import { YSlider } from './YSlider';

export interface YPlayerControlsProps {
  playing: boolean;
  onToggle: () => void;
  seconds: number;
  duration: number;
  onSeek: (seconds: number) => void;
  labels: { play: string; pause: string; seek: string; fullscreen?: string };
  onFullscreen?: () => void;
  actions?: ReactNode;
}
export function YPlayerControls({ playing, onToggle, seconds, duration, onSeek, labels, onFullscreen, actions }: YPlayerControlsProps) {
  return (
    <YorollThemeProvider>
      <View style={styles.root}>
        <YSlider label={labels.seek} min={0} max={Math.max(1, duration)} value={seconds} disabled={duration <= 0} onChange={onSeek} />
        <View style={styles.actions}>
          <YIconButton icon={playing ? IconPauseFilled : IconPlayFilled} variant="media"
            onPress={onToggle} label={playing ? labels.pause : labels.play} />
          <View style={styles.extras}>{actions}</View>
          {onFullscreen && <YIconButton icon={IconShortfullscreen} variant="media" onPress={onFullscreen}
            label={labels.fullscreen ?? 'Fullscreen'} />}
        </View>
      </View>
    </YorollThemeProvider>
  );
}
const styles = StyleSheet.create({
  root: { backgroundColor: '#17171A', borderRadius: 12, padding: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  extras: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 4 },
});
