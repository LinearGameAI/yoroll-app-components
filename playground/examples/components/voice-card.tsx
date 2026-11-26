import { useState } from 'react';
import { View } from 'react-native';
import { YVoiceCard } from '@yoroll/app-components';

export default function Example() {
  const [voice, setVoice] = useState('清朗');
  const [playing, setPlaying] = useState('');
  return (
    <View accessibilityRole="radiogroup" style={{ width: '100%', flexDirection: 'row', gap: 8 }}>
      {['清朗', '低沉'].map((name) => <YVoiceCard key={name} name={name} style={{ flex: 1 }}
        selected={voice === name} onSelect={() => setVoice(name)} playing={playing === name}
        previewLabel={(playing === name ? '停止试听 · ' : '试听 · ') + name}
        onPreview={() => setPlaying(playing === name ? '' : name)} />)}
    </View>
  );
}
