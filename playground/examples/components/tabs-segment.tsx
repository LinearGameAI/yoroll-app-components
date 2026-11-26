import { useState } from 'react';
import { YTab } from '@yoroll/app-components';

const items = [
  { key: 'feature', label: '推荐' },
  { key: 'following', label: '关注' },
  { key: 'saved', label: '收藏' },
];

export default function TabsExample() {
  const [active, setActive] = useState('feature');
  return <YTab style={{ width: '100%', maxWidth: 280 }} variant="segment" items={items} active={active} onChange={setActive} />;
}
