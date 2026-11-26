import { IconClose, IconPhonecall, IconSoundOff, IconSoundOn, IconVoicemute, IconVoiceunmute } from '@yoroll/rn-icon';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { darkTokens } from '../tokens';
import { componentText } from '../typography';
import { YAvatar } from './YAvatar';
import { YIconButton, type YIconButtonProps } from './YIconButton';

export interface YCallPanelProps {
  name: string;
  status: string;
  phase: 'connecting' | 'connected' | 'ending' | 'failed';
  avatar?: string;
  cover?: ImageSource | string;
  muted?: boolean;
  speaker?: boolean;
  labels: { mic: string; speaker: string; hangup: string };
  onMute?: () => void;
  onSpeaker?: () => void;
  onHangup: () => void;
}
export function YCallPanel({ name, status, phase, avatar, cover, muted, speaker, labels, onMute, onSpeaker, onHangup }: YCallPanelProps) {
  const failed = phase === 'failed';
  return (
    <View style={styles.panel}>
      {cover && <Image source={cover} style={StyleSheet.absoluteFill} contentFit="cover" />}
      <LinearGradient pointerEvents="none" colors={['rgba(11,11,13,0.38)', 'rgba(11,11,13,0.58)', 'rgba(11,11,13,0.92)']}
        style={StyleSheet.absoluteFill} />
      <YAvatar name={name} src={avatar} size={120} />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.status}>
        {phase === 'connecting' && <ActivityIndicator color={darkTokens.orange} />}
        <Text accessibilityLiveRegion="polite" style={[componentText.callStatus, { color: failed ? darkTokens.textWrong : '#D6D6D4' }]}>{status}</Text>
      </View>
      <View style={styles.actions}>
        {!failed && onMute && <CallAction icon={muted ? IconVoicemute : IconVoiceunmute} label={labels.mic} onPress={onMute}
          selected={!muted} disabled={phase !== 'connected'} />}
        <CallAction icon={failed ? IconClose : IconPhonecall} label={labels.hangup} onPress={onHangup} danger disabled={phase === 'ending'} />
        {!failed && onSpeaker && <CallAction icon={speaker ? IconSoundOn : IconSoundOff} label={labels.speaker} onPress={onSpeaker}
          selected={speaker} disabled={phase !== 'connected'} />}
      </View>
    </View>
  );
}
function CallAction({ danger, ...props }: YIconButtonProps & { danger?: boolean }) {
  const fill = danger ? '#FF4D4F' : props.selected ? '#FFFFFF' : 'rgba(255,255,255,0.20)';
  return <View style={styles.action}>
    <YIconButton {...props} color={!danger && props.selected ? darkTokens.dark : '#FFFFFF'} size={72} iconSize={28} style={{ backgroundColor: fill }} />
    <Text style={[componentText.feedback, styles.actionLabel]}>{props.label}</Text>
  </View>;
}
const styles = StyleSheet.create({
  panel: { minHeight: 352, justifyContent: 'center', alignItems: 'center', padding: 16, gap: 10,
    backgroundColor: darkTokens.bgSecondary, borderRadius: 16, overflow: 'hidden' },
  name: { ...componentText.callTitle, color: '#FFFFFF', textAlign: 'center' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 20 },
  action: { width: 76, alignItems: 'center', gap: 5 },
  actionLabel: { color: '#FFFFFF', textAlign: 'center' },
});
