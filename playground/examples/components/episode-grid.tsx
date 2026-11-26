import { useState } from 'react';
import { YEpisodeGrid } from '@yoroll/app-components';

export default function Example() {
  const [active, setActive] = useState('1');
  return (
    <YEpisodeGrid active={active} onSelect={setActive} episodes={[
      { id: '1', label: '01' }, { id: '2', label: '02' }, { id: '3', label: '03', locked: true, lockLabel: '会员' },
    ]} />
  );
}
