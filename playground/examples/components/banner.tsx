import { useState } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { TreatText, YBanner } from '@yoroll/app-components';

export default function Example() {
  const [claimed, setClaimed] = useState(false);
  return (
    <View style={{ width: '100%', gap: 8 }}>
      <YBanner variant="reward" title="每日签到" detail={claimed ? '已领取' : '第 1 天'}
        reward={<TreatText style={{ fontSize: 14, fontWeight: '700' }}>+10</TreatText>}
        artwork={<Image source="./artwork/originals/assets/tasks/checkin-v1.webp" style={StyleSheet.absoluteFill} contentFit="contain" />}
        action={{ label: claimed ? '已完成' : '立即签到', disabled: claimed, onPress: () => setClaimed(true) }} />
      <YBanner variant="warning" title="Treats 余额不足" detail="充值后可以继续使用当前模型。" />
    </View>
  );
}
