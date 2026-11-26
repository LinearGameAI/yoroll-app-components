import { useState } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { dramaProgressStyles } from '../appStyles';
import { useTheme } from '../theme';
import { componentText } from '../typography';
import { steppedValue, type YSliderProps } from './sliderValue';
export type { YSliderProps } from './sliderValue';

export function YSlider({ label, value, min, max, step = 1, disabled, variant = 'appearance', onChange }: YSliderProps) {
  const { tokens } = useTheme();
  const playback = variant === 'playback';
  const [width, setWidth] = useState(0);
  const change = (next: number) => { if (!disabled) onChange(steppedValue(next, min, max, step)); };
  const fraction = Math.max(0, Math.min(1, (value - min) / Math.max(max - min, step)));
  const fromTouch = (locationX: number) => {
    const inset = playback ? 0 : 12;
    if (width > 0) change(min + (max - min) * Math.max(0, Math.min(1, (locationX - inset) / Math.max(1, width - 2 * inset))));
  };
  return (
    <View>
      {!playback && <View style={styles.heading}>
        <Text style={[componentText.rowLabel, { color: tokens.textPrimary }]}>{label}</Text>
        <Text style={[componentText.modelBody, { color: tokens.textSecondary }]}>{value}</Text>
      </View>}
      <View accessible accessibilityRole="adjustable" accessibilityLabel={label}
        accessibilityState={{ disabled }} accessibilityValue={{ min, max, now: value }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={({ nativeEvent }) => change(value + (nativeEvent.actionName === 'increment' ? step : -step))}
        onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
        onStartShouldSetResponder={() => !disabled}
        onResponderGrant={({ nativeEvent }) => fromTouch(nativeEvent.locationX)}
        onResponderMove={({ nativeEvent }) => fromTouch(nativeEvent.locationX)}
        style={[styles.touch, playback && styles.playbackTouch, { opacity: disabled ? 0.45 : 1 }]}>
        <View pointerEvents="none" style={[styles.track, playback ? [styles.playbackTrack, dramaProgressStyles.track] : { backgroundColor: tokens.bgTertiary }]}>
          <View style={{ backgroundColor: playback ? '#FFFFFF' : tokens.orange, width: (fraction * 100 + '%') as ViewStyle['width'], height: '100%' }} />
        </View>
        {!playback && <View pointerEvents="none" style={[styles.thumb, { backgroundColor: tokens.textPrimary, left: fraction * Math.max(0, width - 24) }]} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 6 },
  touch: { height: 44, justifyContent: 'center' },
  playbackTouch: { height: 22, justifyContent: 'flex-end' },
  playbackTrack: { height: 2, marginHorizontal: 0, borderRadius: 0 },
  track: { height: 4, marginHorizontal: 12, borderRadius: 2, overflow: 'hidden' },
  thumb: { position: 'absolute', top: 10, width: 24, height: 24, borderRadius: 12 },
});
