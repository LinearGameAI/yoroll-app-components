import { useState } from 'react';
import { YChoiceGroup } from '@yoroll/app-components';

export default function Example() {
  const [value, setValue] = useState('zh');
  return (
    <YChoiceGroup label="字幕语言" value={value} onChange={setValue} items={[
      { key: 'zh', label: '简体中文' }, { key: 'en', label: 'English' },
      { key: 'off', label: '关闭字幕' },
    ]} />
  );
}
