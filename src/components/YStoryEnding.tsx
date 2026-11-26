import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { typography } from '../typography';
import { StoryAction } from './storyAction';

export interface YStoryEndingProps {
  variant: 'chapter' | 'game' | 'death';
  title: string;
  emphasis?: string;
  detail?: string;
  artwork?: ReactNode;
  next?: { label: string; onPress: () => void };
  episodes?: { label: string; onPress: () => void };
  style?: StyleProp<ViewStyle>;
}

const clearWhite = 'rgba(255,255,255,0)';
export function YStoryEnding({ variant, title, emphasis, detail, artwork, next, episodes, style }: YStoryEndingProps) {
  const chapter = variant === 'chapter';
  return (
    <View style={[styles.root, style]}>
      {artwork && <View pointerEvents="none" style={StyleSheet.absoluteFill}>{artwork}</View>}
      <View style={styles.scrim}>
        <View style={styles.heading}>
          <LinearGradient colors={[clearWhite, '#FFFFFF']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.line} />
          <View style={styles.dot} />
          <Text accessibilityRole="header" style={[styles.title, variant === 'death' && styles.death]}>
            {title}{chapter && emphasis ? <Text style={styles.emphasis}>{' '}{emphasis}</Text> : null}
          </Text>
          <View style={styles.dot} />
          <LinearGradient colors={['#FFFFFF', clearWhite]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.line} />
        </View>
        {detail && <Text style={styles.detail} numberOfLines={2}>{detail}</Text>}
        {chapter && (next || episodes) && <View style={styles.actions}>
          {next && <StoryAction {...next} style={styles.action} />}
          {episodes && <StoryAction {...episodes} style={styles.action} />}
        </View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'relative', overflow: 'hidden', minHeight: 176, backgroundColor: '#17171A' },
  scrim: { flex: 1, minHeight: 176, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 16, backgroundColor: 'rgba(0,0,0,0.60)' },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  line: { width: 30, maxWidth: '14%', height: 1, flexShrink: 1 },
  dot: { width: 2, height: 2, borderRadius: 1, backgroundColor: '#FFFFFF' },
  title: { flexShrink: 1, fontSize: 20, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  death: { color: '#FF4F4F' },
  emphasis: { color: '#F7CF6D' },
  detail: { ...typography.creatorBody, marginTop: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 24 },
  action: { minWidth: 112 },
});
