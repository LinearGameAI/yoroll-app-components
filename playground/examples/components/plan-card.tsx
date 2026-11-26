import { useState } from 'react';
import { View } from 'react-native';
import { YPlanCard, YPurchaseBackdrop } from '@yoroll/app-components';

const base = './artwork/originals/assets/membership/';
const basic = [
  { label: '每月 Treats', value: '1,000', artwork: base + 'benefits/monthly-treats-v2.webp' },
  { label: '建议回复', value: '100 次', artwork: base + 'benefits/suggested-replies-v2.webp' },
  { label: '可创建人设数', value: '5 个', artwork: base + 'benefits/persona-card-v2.webp' },
];

export default function Example() {
  const [tier, setTier] = useState<'basic' | 'plus'>('basic');
  const [annual, setAnnual] = useState(true);
  const selected = tier === 'plus';
  return (
    <View style={{ position: 'relative', width: '100%', borderRadius: 14, overflow: 'hidden', gap: 16, padding: 10, paddingTop: 18 }}>
      <YPurchaseBackdrop tier={tier} cover={base + 'backgrounds/' + (selected ? 'plus-romance-v3.jpg' : 'basic-romance-v4.jpg')} />
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 8 }}>
        <YPlanCard title="PLUS" benefits={basic} current="当前方案"
          selected={!selected} onSelect={() => setTier('basic')} style={{ flex: 1 }} />
        <YPlanCard title="ULTRA" tier="plus" benefits={basic.map((item, index) => ({ ...item, value: index ? '不限' : '3,600' }))}
          selected={selected} onSelect={() => setTier('plus')} style={{ flex: 1 }} />
      </View>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 8 }}>
        <YPlanCard variant="cycle" tier={tier} title="按年订阅" price={selected ? '¥418' : '¥298'}
          offer={selected ? { label: '限时折扣', countdown: '02:18:36' } : undefined}
          selected={annual} onSelect={() => setAnnual(true)} style={{ flex: 1 }} />
        <YPlanCard variant="cycle" tier={tier} title="按月订阅" price={selected ? '¥68' : '¥48'}
          selected={!annual} onSelect={() => setAnnual(false)} style={{ flex: 1 }} />
      </View>
    </View>
  );
}
