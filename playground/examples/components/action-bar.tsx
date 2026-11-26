import { useState } from 'react';
import { YActionBar } from '@yoroll/app-components';

export default function Example() {
  const [saved, setSaved] = useState(false);
  return (
    <YActionBar primary={{ label: saved ? '已保存' : '保存', disabled: saved, onPress: () => setSaved(true) }}
      secondary={{ label: '取消', onPress: () => setSaved(false) }} safeArea={false} />
  );
}
