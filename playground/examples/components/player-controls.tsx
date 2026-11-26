import { useState } from 'react';
import { YPlayerControls } from '@yoroll/app-components';

export default function Example() {
  const [time, setTime] = useState(28);
  const [playing, setPlaying] = useState(false);
  return (
    <YPlayerControls playing={playing} onToggle={() => setPlaying(!playing)} seconds={time} duration={120} onSeek={setTime}
      labels={{ play: '播放', pause: '暂停', seek: '播放进度' }} />
  );
}
