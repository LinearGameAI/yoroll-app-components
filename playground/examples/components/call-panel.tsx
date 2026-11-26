import { useState } from 'react';
import { YCallPanel } from '@yoroll/app-components';

export default function Example() {
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [ended, setEnded] = useState(false);
  return (
    <YCallPanel name="月光旅人" status={ended ? '通话已结束' : '00:24'} phase={ended ? 'failed' : 'connected'}
      labels={{ mic: muted ? '开启麦克风' : '静音', speaker: speaker ? '关闭扬声器' : '开启扬声器', hangup: ended ? '重新预览' : '挂断' }}
      muted={muted} speaker={speaker} onMute={() => setMuted(!muted)} onSpeaker={() => setSpeaker(!speaker)}
      onHangup={() => setEnded(!ended)} />
  );
}
