import { useState } from 'react';
import { View } from 'react-native';
import { YStoryEnding, YTab } from '@yoroll/app-components';

export default function Example() {
  const [variant, setVariant] = useState<'chapter' | 'game' | 'death'>('chapter');
  const [episode, setEpisode] = useState(1);
  return (
    <View style={{ width: '100%', gap: 8 }}>
      <YTab variant="segment" active={variant} onChange={(key) => setVariant(key as typeof variant)}
        items={[{ key: 'chapter', label: '本集结束' }, { key: 'game', label: '游戏结束' }, { key: 'death', label: '失败结局' }]} />
      <YStoryEnding variant={variant} title={variant === 'chapter' ? '第 ' + episode + ' 集' : variant === 'game' ? '故事结束' : '探索失败'}
        emphasis="播放完成" detail="看看下一集会发生什么。"
        next={{ label: '下一集', onPress: () => setEpisode(episode + 1) }}
        episodes={{ label: '重新选择', onPress: () => setEpisode(1) }} />
    </View>
  );
}
