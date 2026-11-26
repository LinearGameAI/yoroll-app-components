import { useEffect, useRef, useState } from 'react';
import { IconClose, IconSearch } from '@yoroll/rn-icon';

export type SearchEntry = { title: string; href: string; section: string; keywords?: string };

export function CatalogSearch({ entries }: { entries: SearchEntry[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const firstResult = useRef<HTMLAnchorElement>(null);
  const [query, setQuery] = useState('');
  const keywords = query.trim().toLowerCase().split(/\s+/);
  const matches = entries.filter(({ title, section, keywords: extra }) =>
    keywords.every((keyword) => [title, section, extra ?? ''].join(' ').toLowerCase().includes(keyword)));
  const shown = matches.slice(0, 9);

  function open() {
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
    setQuery('');
    input.current?.focus();
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !event.repeat) {
        event.preventDefault();
        if (!dialog.current?.open) open();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <>
      <button type="button" className="catalog-search-trigger" onClick={open} aria-label="搜索组件库">
        <IconSearch size={16} color="currentColor" />
        <span>搜索组件库</span>
        <kbd>{navigator.platform.startsWith('Mac') ? '⌘ K' : 'Ctrl K'}</kbd>
      </button>
      <dialog ref={dialog} className="catalog-search-dialog" aria-label="搜索组件库" onClick={(event) => {
        if (event.currentTarget === event.target) dialog.current?.close();
      }} onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          dialog.current?.close();
        }
      }}>
        <form role="search" className="catalog-search-form" onSubmit={(event) => {
          event.preventDefault();
          if (shown[0]) {
            window.location.hash = shown[0].href;
            dialog.current?.close();
          }
        }}>
          <IconSearch size={18} color="currentColor" />
          <input
            ref={input}
            type="search"
            aria-label="搜索文档"
            placeholder="输入组件名、组合或 Token"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' && firstResult.current) {
                event.preventDefault();
                firstResult.current.focus();
              }
            }}
          />
          <button type="button" aria-label="关闭搜索" onClick={() => dialog.current?.close()}>
            <IconClose size={18} color="currentColor" />
          </button>
        </form>
        <ul className="catalog-search-results" aria-label="搜索结果">
          {shown.map((entry, index) => (
            <li key={entry.href}>
              <a ref={index === 0 ? firstResult : undefined} href={entry.href} onClick={() => dialog.current?.close()}>
                <strong>{entry.title}</strong><span>{entry.section}</span>
              </a>
            </li>
          ))}
        </ul>
        {!shown.length && <p className="catalog-search-empty" role="status">没有匹配的文档。</p>}
      </dialog>
    </>
  );
}
