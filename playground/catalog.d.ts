declare module 'catalog-examples' {
  import type { ComponentType } from 'react';
  export const examples: Record<string, { Preview: ComponentType; code: string } | undefined>;
}
