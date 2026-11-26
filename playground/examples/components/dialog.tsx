import { useState } from 'react';
import { IconTreatsFilled } from '@yoroll/rn-icon';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { TreatText, YButton, YDialog } from '@yoroll/app-components';

export default function Example() {
  const [variant, setVariant] = useState('');
  const reward = variant === 'reward';
  return (
    <View style={{ gap: 8 }}>
      <YButton label="离开确认" onPress={() => setVariant('confirm')} />
      <YButton label="新人奖励" variant="secondary" onPress={() => setVariant('reward')} />
      <YDialog visible={Boolean(variant)} variant={reward ? 'reward' : 'confirm'}
        title={reward ? '新人奖励' : '要保存修改吗？'}
        description={reward ? undefined : '关闭后，未保存的内容将丢失。'}
        artwork={reward ? <Image source="./artwork/originals/assets/profile/treat-trio-v1.webp"
          style={{ width: 128, height: 110 }} contentFit="contain" /> : undefined}
        closeLabel="关闭弹窗" onClose={() => setVariant('')}
        primary={{ label: reward ? '知道了！' : '保存并离开', onPress: () => setVariant('') }}
        secondary={variant === 'confirm' ? { label: '放弃修改', onPress: () => setVariant('') } : undefined}>
        {reward && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <IconTreatsFilled size={24} color="#FF9CD5" />
          <TreatText style={{ fontSize: 28, lineHeight: 36, fontFamily: 'GeologicaSemiBold', fontWeight: '600' }}>50</TreatText>
        </View>}
      </YDialog>
    </View>
  );
}
