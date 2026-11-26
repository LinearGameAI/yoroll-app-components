import { useState } from 'react';
import { YSwitch, YListRow } from '@yoroll/app-components';

export default function Example() {
  const [enabled, setEnabled] = useState(false);
  return (
    <YListRow title="提醒我签到" trailing={<YSwitch label="提醒我签到" value={enabled} onChange={setEnabled} />} />
  );
}
