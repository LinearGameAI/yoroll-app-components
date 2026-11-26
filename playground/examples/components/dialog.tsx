import { useState } from 'react';
import { View } from 'react-native';
import { YDialog, YButton, TreatText } from '@yoroll/app-components';

export default function Example() {
  const [variant, setVariant] = useState('');
  return (
    <View style={{ gap: 8 }}>
      <YButton label="离开确认" onPress={() => setVariant('confirm')} />
      <YButton label="奖励公告" variant="secondary" onPress={() => setVariant('reward')} />
      <YDialog visible={Boolean(variant)} variant={variant === 'reward' ? 'reward' : 'confirm'}
        title={variant === 'reward' ? '收到 Treats' : '要保存修改吗？'}
        description={variant === 'reward' ? '完成了今天的签到。' : '关闭后，未保存的内容将丢失。'}
        artwork={variant === 'reward' ? <TreatText style={{ fontSize: 28, textAlign: 'center' }}>+30</TreatText> : undefined}
        closeLabel="关闭弹窗" onClose={() => setVariant('')}
        primary={{ label: variant === 'reward' ? '领取' : '保存并离开', onPress: () => setVariant('') }}
        secondary={variant === 'confirm' ? { label: '放弃修改', onPress: () => setVariant('') } : undefined} />
    </View>
  );
}
