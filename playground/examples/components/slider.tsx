import { useState } from 'react';
import { YSlider } from '@yoroll/app-components';

export default function Example() {
  const [value, setValue] = useState(15);
  return (
    <YSlider label="聊天字号" min={13} max={22} value={value} onChange={setValue} />
  );
}
