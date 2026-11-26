import { useState } from 'react';
import { Image } from 'expo-image';
import { YCreditPackCard } from '@yoroll/app-components';

export default function Example() {
  const [price, setPrice] = useState<string | undefined>('¥30');
  return (
    <YCreditPackCard amount="1,000" bonus="+120 加赠" badge="热门" price={price} retryLabel="刷新价格"
      artwork={<Image source="./artwork/originals/assets/membership/treat-packs/treat-single-v1.webp" contentFit="contain" style={{ width: 54, height: 54 }} />}
      onPurchase={() => setPrice(undefined)} onRetry={() => setPrice('¥30')} />
  );
}
