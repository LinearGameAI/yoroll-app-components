import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { YButton, YStoryChoices } from '@yoroll/app-components';

export default function Example() {
  const [selected, setSelected] = useState('');
  const [remaining, setRemaining] = useState(10);
  const [running, setRunning] = useState(false);
  const canPick = !selected && remaining > 0;
  useEffect(() => {
    if (!running || !canPick) return;
    const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [running, canPick]);
  return (
    <View style={{ width: '100%', gap: 8 }}>
      <YStoryChoices title="下一步去哪？" selected={selected} onSelect={setSelected}
        choices={[{ key: 'station', label: '去车站' }, { key: 'seaside', label: '留在海边' }]}
        timer={{ remaining, total: 10, label: remaining + ' 秒' }} disabled={!canPick} />
      <YButton label={running ? '从头开始' : '启动倒计时'} size="sm" variant="secondary"
        onPress={() => { setSelected(''); setRemaining(10); setRunning(true); }} />
    </View>
  );
}
