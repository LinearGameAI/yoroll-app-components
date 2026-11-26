import { useState } from 'react';
import { IconAdd, IconSendup, IconVoiceinput } from '@yoroll/rn-icon';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { controlMetrics } from '../foundations';
import { useTheme } from '../theme';
import { componentText } from '../typography';
import { YIconButton } from './YIconButton';

export interface YComposerProps {
  value: string;
  onChangeText: (value: string) => void;
  onSend: (value: string) => void;
  onAdd?: () => void;
  onVoice?: () => void;
  disabled?: boolean;
  busy?: boolean;
  placeholder: string;
  inputLabel?: string;
  sendLabel?: string;
  addLabel?: string;
  voiceLabel?: string;
  error?: string;
}
const metrics = controlMetrics.composer;
export function YComposer({ value, onChangeText, onSend, onAdd, onVoice, disabled, busy, placeholder, inputLabel,
  sendLabel = 'Send', addLabel = 'More actions', voiceLabel = 'Voice input', error }: YComposerProps) {
  const { tokens } = useTheme();
  const [height, setHeight] = useState<number>(metrics.control);
  const text = value.trim();
  const send = () => { if (text && !disabled && !busy) onSend(text); };
  return (
    <View style={styles.root}>
      {error && <Text accessibilityLiveRegion="polite" style={[componentText.modelBody, { color: tokens.textWrong }]}>{error}</Text>}
      <View style={styles.row}>
        {onAdd && <YIconButton icon={IconAdd} label={addLabel} onPress={onAdd} disabled={disabled} variant="surface" />}
        <View style={[styles.inputWrap, { backgroundColor: tokens.bgSecondary, borderColor: tokens.cardStroke }]}>
          <TextInput multiline accessibilityLabel={inputLabel ?? placeholder} editable={!disabled} value={value} onChangeText={onChangeText}
            onContentSizeChange={(event) => setHeight(Math.min(metrics.maxInputHeight, Math.max(metrics.control, event.nativeEvent.contentSize.height)))}
            placeholder={placeholder} placeholderTextColor={tokens.textTertiary}
            style={[styles.input, { color: tokens.textPrimary, height }]} />
          {text || !onVoice ? <YIconButton icon={IconSendup} label={sendLabel} onPress={send} disabled={!text || disabled || busy}
            color={tokens.orange} /> : <YIconButton icon={IconVoiceinput} label={voiceLabel} onPress={onVoice} disabled={disabled || busy} />}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  inputWrap: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'flex-end',
    borderRadius: metrics.control / 2, borderWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, minWidth: 0, fontSize: 15, lineHeight: metrics.lineHeight, paddingLeft: 14,
    paddingVertical: metrics.verticalPadding, textAlignVertical: 'top' },
});
