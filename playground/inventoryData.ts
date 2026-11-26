export type AssetPrompt = {
  source: string;
  method?: string;
  created?: string;
  references: string[];
  stages: { label: string; field: string; text: string }[];
};

export type Asset = {
  path: string; kind: 'image' | 'font' | 'video' | 'animation' | 'spec'; bytes: number; usedBy: string[];
  previewUrl?: string; availability: 'metadata' | 'missing' | 'lfs' | 'preview';
  prompts?: AssetPrompt[];
};

export type Pair = { name: string; value: string };
type Motion = { api: string; line: number; settings: Pair[] };
export type Source = {
  path: string; group: 'shared' | 'route' | 'feature' | 'native';
  components: { name: string; line: number }[];
  tokens: string[]; icons: string[]; assets: string[];
  styles: { name: string; line: number; values: Pair[] }[];
  motions: Motion[];
};
export type Inventory = {
  revision: string; changed: boolean; sources: Source[]; assets: Asset[]; missing: string[];
  themeColors: { dark: Record<string, string>; light: Record<string, string> };
};

export function readAppInventory(): Inventory | null {
  const data = document.getElementById('app-inventory-data')?.textContent;
  try {
    return data ? JSON.parse(data) as Inventory : null;
  } catch {
    return null;
  }
}
