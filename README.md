# Yoroll App 组件库

YorollApp 的 React Native 组件、组合示例和设计规范。示例的预览与 TSX 使用同一份文件。组件页提供安装、用法、参数、Token 和源码入口。

[打开组件库](https://lineargameai.github.io/yoroll-app-components/) · [接入指南](https://lineargameai.github.io/yoroll-app-components/#start) · [组件](https://lineargameai.github.io/yoroll-app-components/#components) · [组合](https://lineargameai.github.io/yoroll-app-components/#blocks) · [字体与字号](https://lineargameai.github.io/yoroll-app-components/#tokens/typography) · [图素](https://lineargameai.github.io/yoroll-app-components/#assets)

| 栏目 | 内容 |
| --- | --- |
| 组件 | 按钮、输入框、播放入口、页签、顶部导航、导航底色、头像、骨架、轮播点、Treats 金额 |
| 组合示例 | 资料编辑表单、修改确认框、列表加载与空态 |
| 设计 Token | App 的深浅语义色、字族与字级、间距、控件尺寸、弹层、渐变和阴影 |
| 动效 | 时长、缓动、生命周期、系统减少动态效果和网页播放示意 |
| 图素 | 素材的风格、参考色板和可复制的延展提示词。本机版可查看原图和已归档的生成记录 |

设计基线取自 YorollApp `0983ce7b2`。组件与规则的 App 实现链接使用该源码版本，持有 App 仓库权限的成员可以打开。App 默认使用深色，浅色保留为预览选项。

## 在代码里使用

组件入口面向 Expo SDK 54 / React Native 0.81。通过 Git 安装时，在团队项目里将依赖固定到所选提交。使用 `YorollThemeProvider` 切换组件主题，渲染 `YTopBar` 时由宿主提供 `SafeAreaProvider`。

```sh
npm install git+https://github.com/LinearGameAI/yoroll-app-components.git
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
| 字体与字号 | `typography`、`systemFonts`、`customFontNames`、`useTheme().fonts`、`useTheme().fontWeights` |
| 组件与聊天字级 | `avatarInitialTypography`、`buttonLabelTypography`、`tabLabelTypography`、`playPillLabelTypography`、`chatFontSize`、`chatMessageTypography` |
| 阴影和渐变 | `shadowPresets`、`TREAT_GRADIENT`、`TREAT_TEXT_GRADIENT` |
| 动效参数 | `motionTokens`，按 App 具体场景命名 |

在自定义页面组合排版和主题 Token。

```tsx
import { typography, useTheme } from '@yoroll/app-components';
import { Text } from 'react-native';

function SectionTitle({ children }: { children: string }) {
  const { fontWeights, tokens } = useTheme();
  return (
    <Text style={[typography.navigationTitle, { fontFamily: fontWeights.dispMedium, color: tokens.textPrimary }]}>
      {children}
    </Text>
  );
}
```

功能图标在独立的 [LinearGameAI 图标库](https://lineargameai.github.io/linear-game-icons/) 维护。

## 获取源码

[注册表 JSON](https://lineargameai.github.io/yoroll-app-components/registry.json) 提供组件和组合的文档入口。每项的 `entry` 指向入口，`files` 包含文件相对路径与原文，`dependencies` 列出源码导入的包，`peerDependencies` 列出 React Native 宿主要求。拷贝单项的实现时按清单保留相对路径。组合示例通过 `@yoroll/app-components` 引用基础组件。

[YButton 源码清单](https://lineargameai.github.io/yoroll-app-components/r/ybutton.json) · [资料表单的 TSX 和依赖](https://lineargameai.github.io/yoroll-app-components/r/profile-form.json)

## App 完整索引

在拥有 YorollApp checkout 的机器上生成索引。构建从当前 checkout 读取组件、样式、字体、素材图和动效，保留源码位置。

```sh
npm ci
npm run build:app -- /absolute/path/to/YorollApp
```

用浏览器打开本机的 `dist-app/index.html`。在 **图素** 查看同一风格的代表素材和延展提示词。在 **App 索引 → 素材图库** 按名称、风格、代码引用或原始提示词查找所有素材图。卡片可打开原图、查找使用位置并复制 `*.prompt.json` 与 `generation-prompt*.json` 中的原始提示词，包括已保存的后续编辑步骤。

**设计 Token → 字体与字号** 提供已核对的字体、字号、行高、字重、字距和对应 Token，本机版也能预览 App 字体文件。**App 索引 → 字体与字号** 可搜索 App 源码中的实际排版属性和表达式。索引来自静态扫描，运行时取值以对应实现为准。

公开 GitHub Pages 提供排版规范、素材风格和延展提示词。App 原图、字体文件、原始提示词和源码索引保存在本机生成的 `dist-app/`。

## 开发与发布

使用 Node.js 22。

```sh
npm ci
npm run check
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

入口代码在 `src/index.ts`，主题色在 `src/tokens.ts`，排版样式在 `src/typography.ts`，尺寸与视觉参数在 `src/foundations.ts`，动效参数在 `src/motion.ts`。组件示例写在 `playground/examples/components/`，在 `playground/demos.tsx` 配置名称、参数与 App 源码路径。组合示例在 `playground/examples/blocks/`，素材风格定义在 `playground/artStyles.ts`。GitHub Actions 从 `main` 发布公开构建和注册表到 GitHub Pages。
