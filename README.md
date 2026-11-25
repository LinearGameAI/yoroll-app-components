# Yoroll App 组件库

YorollApp 的 React Native 基础组件和交互目录。网页预览直接运行组件库的实现，可以切换深浅色、体验交互状态、查看常用参数并复制 TSX 示例。

[打开组件库](https://lineargameai.github.io/yoroll-app-components/) · [浏览组件源码](src/components) · [Yoroll 图标预览](https://lineargameai.github.io/linear-game-icons/)

| 分类 | 组件 |
| --- | --- |
| 操作与输入 | `YButton`、`YTextInput`、`YPlayPill` |
| 导航 | `YTab`、`YTopBar`、`NavigationBarMaterial` |
| 展示与反馈 | `YAvatar`、`SkeletonBlock` |

## 本地开发

使用 Node.js 22。

```sh
npm ci
npm run check
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

访问 [本地组件目录](http://127.0.0.1:4173)。构建产物使用相对路径，由 GitHub Actions 从 `main` 构建并发布到 GitHub Pages。

## 维护组件

组件实现在 `src/components/`，公开导出在 `src/index.ts`，主题在 `src/theme.tsx`。新增组件时，在 `playground/demos.tsx` 补充预览、示例和常用参数。图标复用 `@yoroll/rn-icon`。

组件入口面向 Expo SDK 54 / React Native 0.81。可从 Git 安装并固定到一个提交。使用 `YorollThemeProvider` 切换组件主题，渲染 `YTopBar` 时由宿主提供 `SafeAreaProvider`。

```sh
npm install github:LinearGameAI/yoroll-app-components
```

```tsx
import { YButton, YorollThemeProvider } from '@yoroll/app-components';

export function Example({ onConfirm }: { onConfirm: () => void }) {
  return (
    <YorollThemeProvider mode="dark">
      <YButton label="确认" onPress={onConfirm} />
    </YorollThemeProvider>
  );
}
```
