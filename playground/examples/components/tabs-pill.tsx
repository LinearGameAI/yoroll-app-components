import { useState } from 'react';
import { IconAppfeed, IconGenre, IconHomepage } from '@yoroll/rn-icon';
import { YTab, useTheme } from '@yoroll/app-components';

export default function Example() {
  const [active, setActive] = useState('all');
  const { tokens } = useTheme();
  return (
    <YTab variant="pill" active={active} onChange={setActive} items={[
      { key: 'all', label: '全部', icon: <IconHomepage size={18} color={tokens.orange} /> },
      { key: 'drama', label: '短剧', icon: <IconAppfeed size={18} color={tokens.textSecondary} /> },
      { key: 'games', label: '游戏', icon: <IconGenre size={18} color={tokens.textSecondary} /> },
    ]} />
  );
}
