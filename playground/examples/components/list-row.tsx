import { useState } from 'react';
import { YListRow, YBadge } from '@yoroll/app-components';

export default function Example() {
  const [value, setValue] = useState('简体中文');
  return (
    <YListRow title="语言" detail="设置 App 的显示语言" value={value} divider
      trailing={<YBadge label="常规" />} onPress={() => setValue(value === '简体中文' ? 'English' : '简体中文')} />
  );
}
