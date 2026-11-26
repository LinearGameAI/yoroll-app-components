import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { typography } from '../typography';
import { StoryAction } from './storyAction';

export interface YStoryChoice { key: string; label: string; disabled?: boolean }
export interface YStoryChoicesProps {
  title: string;
  choices: readonly YStoryChoice[];
  selected?: string;
  timer?: { remaining: number; total: number; label: string };
  onSelect: (key: string) => void;
  disabled?: boolean;
}

export function YStoryChoices({ title, choices, selected, timer, onSelect, disabled }: YStoryChoicesProps) {
  const fraction = timer && timer.total > 0 ? Math.min(1, Math.max(0, timer.remaining / timer.total)) : 0;
  const width = (fraction * 100 + '%') as ViewStyle['width'];
  const threeAcross = choices.length === 3 && choices.every((choice) => choice.label.length <= 8);
  return (
    <View style={styles.root}>
      <View style={styles.heading}>
        {timer && <View style={styles.track}><View style={[styles.leftProgress, { width }]} /></View>}
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        {timer && <><Text accessibilityLabel={timer.label} style={styles.timer}>{timer.label}</Text>
          <View style={styles.track}><View style={[styles.progress, { width }]} /></View></>}
      </View>
      <View style={styles.choices}>
        {choices.map(({ key, label, disabled: blocked }) => <StoryAction key={key} label={label} selected={key === selected}
          disabled={disabled || blocked} onPress={() => onSelect(key)} style={threeAcross ? styles.third : styles.half} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { borderRadius: 12, padding: 12, gap: 12, backgroundColor: '#17171A' },
  heading: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.profileLabel, color: '#FFFFFF', textAlign: 'center', flexShrink: 1 },
  timer: { fontSize: 12, lineHeight: 16, color: '#F7CF6D', fontVariant: ['tabular-nums'] },
  track: { flex: 1, minWidth: 8, backgroundColor: 'rgba(255,255,255,0.12)', height: 1 },
  leftProgress: { alignSelf: 'flex-end', backgroundColor: '#F7CF6D', height: 1 },
  progress: { backgroundColor: '#F7CF6D', height: 1 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  third: { flexBasis: '27%', flexGrow: 1, minWidth: 68 },
  half: { flexBasis: '44%', flexGrow: 1, minWidth: 92 },
});
