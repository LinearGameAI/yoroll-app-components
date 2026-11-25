# Yoroll App 组件库

YorollApp 的 React Native 组件、设计 Token、动效和图素目录。组件预览运行库里的实现，支持深浅色对照、参数查询和 TSX 示例复制。

[打开组件库](https://lineargameai.github.io/yoroll-app-components/) · [设计 Token](https://lineargameai.github.io/yoroll-app-components/#tokens) · [动效](https://lineargameai.github.io/yoroll-app-components/#motion) · [图素](https://lineargameai.github.io/yoroll-app-components/#assets)

| 栏目 | 内容 |
| --- | --- |
| 组件 | 按钮、输入框、播放入口、页签、顶部导航、导航底色、头像、骨架、轮播点、Treats 金额 |
| 设计 Token | App 的深浅语义色、字体、间距、控件尺寸、弹层、渐变和阴影 |
| 动效 | 时长、缓动、生命周期、系统减少动态效果和网页播放示意 |
| 图素 | 来自 `@yoroll/rn-icon` 的可搜索图标预览、尺寸和代码片段 |

设计基线取自 YorollApp `0983ce7b2`。组件与规则的 App 实现链接使用该源码版本，持有 App 仓库权限的成员可以打开。App 默认使用深色，浅色保留为预览选项。

## 在代码里使用

组件入口面向 Expo SDK 54 / React Native 0.81。通过 Git 安装时，在团队项目里将依赖固定到所选提交。使用 `YorollThemeProvider` 切换组件主题，渲染 `YTopBar` 时由宿主提供 `SafeAreaProvider`。

```sh
npm install github:LinearGameAI/yoroll-app-components
```

```tsx
import { YButton, YorollThemeProvider, layout, useTheme } from '@yoroll/app-components';
import { View } from 'react-native';

function ExampleContent({ onConfirm }: { onConfirm: () => void }) {
  const { tokens } = useTheme();
  return (
    <View style={{ paddingHorizontal: layout.gutter, backgroundColor: tokens.bgPrimary }}>
      <YButton label="确认" onPress={onConfirm} />
    </View>
  );
}

export function Example({ onConfirm }: { onConfirm: () => void }) {
  return (
    <YorollThemeProvider mode="dark">
      <ExampleContent onConfirm={onConfirm} />
    </YorollThemeProvider>
  );
}
```

| 复用内容 | 导出 |
| --- | --- |
| 主题色 | `darkTokens`、`lightTokens`、`useTheme().tokens` |
| 布局、控件和弹层 | `layout`、`buttonMetrics`、`inputMetrics`、`tabMetrics`、`sheetMetrics`、`dialogMetrics`、`bottomSheetBottomPadding` |
| 字体、阴影和渐变 | `systemFonts`、`customFontNames`、`shadowPresets`、`TREAT_GRADIENT`、`TREAT_TEXT_GRADIENT` |
| 动效参数 | `motionTokens`，按 App 具体场景命名 |

## App 完整索引

在拥有 YorollApp checkout 的机器上生成索引。界面会读取当前 checkout 的提交和工作区文件，按组件、样式、图素和动效定位源码。图素页面提供原图、字体样张、资源路径和可静态识别的引用。相等的硬编码色值会列出对应候选 Token，主题值发生变化时会列出差异。

```sh
npm ci
npm run build:app -- /absolute/path/to/YorollApp
```

用浏览器打开本机的 `dist-app/index.html`，点击 **App 索引**。索引覆盖 `app/`、`src/` 的 UI 源码、仓库内图素和 iOS、Android 宿主的视觉资源。样式调用、动画参数和资源引用来自静态扫描，运行时取值以链接处的实际实现为准。工作区内容写入本机 `dist-app/`，公开工作流从 `dist/` 上传页面。

## 开发与发布

使用 Node.js 22。

```sh
npm ci
npm run check
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

入口代码在 `src/index.ts`，主题值在 `src/tokens.ts`，尺寸与视觉参数在 `src/foundations.ts`，动效参数在 `src/motion.ts`。新增可预览组件时，在 `playground/demos.tsx` 补上示例、参数与 App 源码路径。GitHub Actions 从 `main` 构建并发布到 GitHub Pages。
