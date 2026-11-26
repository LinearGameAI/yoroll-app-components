import { useState } from 'react';
import { YListGroup, YListRow, YSwitch } from '@yoroll/app-components';

export default function Example() {
  const [enabled, setEnabled] = useState(true);
  return (
    <YListGroup title="通知设置">
      <YListRow title="签到提醒" divider trailing={<YSwitch label="签到提醒" value={enabled} onChange={setEnabled} />} />
      <YListRow title="系统语言" value="简体中文" />
    </YListGroup>
  );
}
