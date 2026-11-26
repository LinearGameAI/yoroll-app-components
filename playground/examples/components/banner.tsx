import { useState } from 'react';
import { View } from 'react-native';
import { YBanner } from '@yoroll/app-components';

export default function Example() {
  const [claimed, setClaimed] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <YBanner variant="warning" title="Treats 余额不足" detail="充值后可以继续使用当前模型。" />
      <YBanner variant="reward" title="每日签到" detail={claimed ? '已领取' : '今日可领 +30 Treats'}
        action={{ label: claimed ? '已完成' : '签到', disabled: claimed, onPress: () => setClaimed(true) }} />
    </View>
  );
}
