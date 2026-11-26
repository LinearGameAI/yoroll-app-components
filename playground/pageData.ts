import appPages from './app-pages.json';
import { screenParts, type ScreenPart } from './examples/screens/screenModel';

export type PageKind = 'screen' | 'debug' | 'layout' | 'alias' | 'redirect' | 'hook';
export type PageSource = [path: string, line?: number];
export type PagePart = { part: ScreenPart; source: PageSource; related?: string[] };
export interface PageEntry {
  id: string;
  title: string;
  group: string;
  kind: PageKind;
  route: string;
  source: PageSource;
  parts?: PagePart[];
  note?: string;
  states?: string[];
  shell?: 'tab' | 'full' | 'detail' | 'standard';
  footer?: string;
  steps?: string[];
  secondary?: string;
  target?: string;
  children?: string[];
}

export const pageEntries = appPages.entries as PageEntry[];
export const pageGroups = appPages.groups;
export const sourceRevision = appPages.revision;

export const pageKinds: Record<PageKind, string> = {
  screen: '产品页面', debug: '调试预览', layout: '导航与覆盖层',
  alias: '复用入口', redirect: '跳转入口', hook: '路由钩子',
};
const byId = new Map(pageEntries.map((entry) => [entry.id, entry]));
export const findPage = (id: string | undefined) => id === undefined ? undefined : byId.get(id);

export const componentsForPart = ({ part, related }: PagePart) => [...new Set([...screenParts[part.kind], ...(related ?? [])])];

export function componentsForPage(entry: PageEntry) {
  const core = entry.states ? ['YScreenLayout', 'YState'] : [];
  if (entry.shell === 'tab') core.push('YBottomNav');
  if (entry.states && entry.shell !== 'full') core.push('YTopBar');
  if (entry.steps) core.push('YTab');
  if (entry.footer) core.push('YActionBar', 'YButton');
  return [...new Set([...core, ...(entry.parts ?? []).flatMap(componentsForPart)])];
}

export const pagesForComponent = (name: string) => pageEntries
  .filter((entry) => entry.states && componentsForPage(entry).includes(name));

export const pageHref = (id: string) => '#pages/' + id;

export function availablePreviewStates(entry: PageEntry) {
  const states = (entry.states ?? []).join(' ');
  return {
    ready: true,
    loading: /加载|处理中|提交中|授权中|连接中|等待|骨架|解析中/.test(states),
    empty: /空态|空列表|为空|无匹配/.test(states),
    error: /错误|失败|异常/.test(states),
  };
}
