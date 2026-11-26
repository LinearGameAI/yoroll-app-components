import { useState } from 'react';
import { View } from 'react-native';
import { YModelCard, YBadge } from '@yoroll/app-components';

export default function Example() {
  const [selected, setSelected] = useState(true);
  return (
    <View accessibilityRole="radiogroup" style={{ gap: 8 }}>
      <YModelCard title="文字对话" description="日常陪伴与互动故事" price="2 / 轮" referencePrice="4 / 轮"
        selected={selected} onSelect={() => setSelected(true)} badge={<YBadge label="限时" variant="brand" />} />
      <YModelCard title="沉浸语音" description="适合语音互动" price="8 / 轮" selected={!selected} onSelect={() => setSelected(false)} />
    </View>
  );
}
