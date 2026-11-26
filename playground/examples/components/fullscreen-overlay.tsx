import { useState } from 'react';
import { View } from 'react-native';
import { YFullscreenOverlay, YButton, YChoiceGroup, YActionBar } from '@yoroll/app-components';

export default function Example() {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState('stories');
  return (
    <View>
      <YButton label="开始设置" onPress={() => setOpen(true)} />
      <YFullscreenOverlay visible={open} title="偏好设置" closeLabel="返回预览" onClose={() => setOpen(false)}
        footer={<YActionBar primary={{ label: '完成', onPress: () => setOpen(false) }} />}>
        <YChoiceGroup label="内容偏好" value={choice} onChange={setChoice}
          items={[{ key: 'stories', label: '互动短剧' }, { key: 'games', label: '小游戏' }]} />
      </YFullscreenOverlay>
    </View>
  );
}
