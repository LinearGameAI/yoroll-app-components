import { useState } from 'react';
import { Image } from 'expo-image';
import { YTab } from '@yoroll/app-components';

const items = [
  { key: 'recommend', label: '推荐' }, { key: 'drama', label: '互动短剧' },
  { key: 'filmgame', label: '互动影游' }, { key: 'minigame', label: '小游戏' },
];

export default function Example() {
  const [active, setActive] = useState('recommend');
  return (
    <YTab variant="pill" active={active} onChange={setActive} items={items.map((item) => ({
      ...item,
      icon: <Image source={'./app-ui/home/' + item.key + '.webp'} contentFit="contain"
        style={{ width: 18, height: 18, opacity: active === item.key ? 1 : 0.6 }} />,
    }))} />
  );
}
