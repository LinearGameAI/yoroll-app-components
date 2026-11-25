import { useEffect, useRef, useState, type ReactNode } from 'react';
import { IconCheck, IconCopy } from '@yoroll/rn-icon';

const appRevision = '0983ce7b25d25b69c151a07459af961b0900fc61';
export const appSourceUrl = (path: string, line?: number, revision = appRevision) =>
  `https://github.com/LinearGameAI/YorollApp/blob/${revision}/${path.split('/').map(encodeURIComponent).join('/')}${line ? `#L${line}` : ''}`;

export function CopyButton({ code, label = '复制代码' }: { code: string; label?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const reset = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(reset.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    window.clearTimeout(reset.current);
    reset.current = window.setTimeout(() => setStatus('idle'), 2400);
  };

  const Icon = status === 'copied' ? IconCheck : IconCopy;
  return (
    <button className="copy-button" type="button" onClick={copy} aria-live="polite">
      <Icon size={14} color="currentColor" />
      {status === 'copied' ? '已复制' : status === 'failed' ? '复制失败' : label}
    </button>
  );
}

export function DirectoryHeading({ title, children, action }: {
  title: string; children: ReactNode; action?: ReactNode;
}) {
  return (
    <header className="directory-heading">
      <div>
        <h1 id="page-title" tabIndex={-1}>{title}</h1>
        <p>{children}</p>
      </div>
      {action && <div className="directory-action">{action}</div>}
    </header>
  );
}

export function SourceLink({ path, line, revision, children = 'App 实现' }: {
  path: string; line?: number; revision?: string; children?: ReactNode;
}) {
  return <a className="inline-source" href={appSourceUrl(path, line, revision)} target="_blank" rel="noreferrer">{children}</a>;
}

export function Segmented<T extends string>({ items, value, onChange, label }: {
  items: readonly { key: T; label: string }[]; value: T; onChange: (value: T) => void; label: string;
}) {
  return (
    <div className="directory-tabs" role="group" aria-label={label}>
      {items.map((item) => (
        <button key={item.key} type="button" aria-pressed={value === item.key} onClick={() => onChange(item.key)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
