import { useState } from 'react';
import { View } from 'react-native';
import { YState, YTab } from '@yoroll/app-components';

export default function Example() {
  const [state, setState] = useState<'loading' | 'empty' | 'error'>('empty');
  return (
    <View style={{ gap: 8 }}>
      <YTab variant="segment" active={state} onChange={(key) => setState(key as typeof state)}
        items={[{ key: 'loading', label: '加载' }, { key: 'empty', label: '空态' }, { key: 'error', label: '失败' }]} />
      <YState state={state} title={{ loading: '正在加载', empty: '暂无消息', error: '消息加载失败' }[state]}
        action={state === 'error' ? { label: '重试', onPress: () => setState('loading') } : undefined} />
    </View>
  );
}
