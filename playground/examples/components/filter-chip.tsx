import { useState } from 'react';
import { View } from 'react-native';
import { YFilterChip } from '@yoroll/app-components';

export default function Example() {
  const [selected, setSelected] = useState(true);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <YFilterChip label="奇幻" selected={selected} variant="filter" onPress={() => setSelected(!selected)} />
      <YFilterChip label="推理" onPress={() => setSelected(false)} />
      <YFilterChip label="冒险" disabled onPress={() => {}} />
    </View>
  );
}
