import { useState } from 'react';
import { YCommentRow, YButton } from '@yoroll/app-components';

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <YCommentRow name="海风" timestamp="2 分钟前" message="第二个结局很有意思。"
      actions={<YButton size="sm" variant="ghost" label={open ? '收起回复' : '展开回复'} onPress={() => setOpen(!open)} />}
      replies={open ? <YCommentRow name="月光旅人" message="下集还有新的分支。" /> : undefined} />
  );
}
