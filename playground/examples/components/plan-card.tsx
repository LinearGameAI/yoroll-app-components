import { useState } from 'react';
import { View } from 'react-native';
import { YPlanCard, YBadge } from '@yoroll/app-components';

export default function Example() {
  const [annual, setAnnual] = useState(true);
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 8 }}>
      <YPlanCard variant="cycle" title="按年订阅" price="¥298" referencePrice="¥598"
        selected={annual} onSelect={() => setAnnual(true)} badge={<YBadge label="限时优惠" variant="brand" />} style={{ flex: 1 }} />
      <YPlanCard variant="cycle" title="按月订阅" price="¥48" selected={!annual} onSelect={() => setAnnual(false)} style={{ flex: 1 }} />
    </View>
  );
}
