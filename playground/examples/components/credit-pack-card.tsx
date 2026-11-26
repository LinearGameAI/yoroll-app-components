import { useState } from 'react';
import { View } from 'react-native';
import { YCreditPackCard } from '@yoroll/app-components';

export default function Example() {
  const [price, setPrice] = useState<string | undefined>('¥12');
  const candy = './artwork/originals/assets/membership/treat-packs/treat-single-v1.webp';
  return (
    <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
      <View style={{ flex: 1, minWidth: 0 }}><YCreditPackCard amount="80" badge="新人专享" badgeTone="newUser"
        artworkSource={candy} loadingPrice /></View>
      <View style={{ flex: 1, minWidth: 0 }}><YCreditPackCard amount="180" bonus="含 10 Treats 加赠" badge="首充加赠"
        price={price} artworkSource={candy} retryLabel="刷新价格" onPurchase={() => setPrice(undefined)} onRetry={() => setPrice('¥12')} /></View>
    </View>
  );
}
