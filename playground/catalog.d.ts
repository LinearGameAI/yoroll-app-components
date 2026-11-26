declare module 'catalog-examples' {
  import type { ComponentType } from 'react';
  export const examples: Record<string, { Preview: ComponentType; code: string } | undefined>;
}

declare module 'app-page-recipes' {
  export const screenExamples: Record<string, {
    recipe: import('./examples/screens/screenModel').ScreenRecipe;
    code: string;
  } | undefined>;
}
