# Yoroll App 组件库

YorollApp 的 React Native 组件、页面组合和设计规范。组件页提供交互预览、可复制 TSX、参数、尺寸与排版 Token，以及 App 源码入口。

[打开组件库](https://lineargameai.github.io/yoroll-app-components/) · [接入指南](https://lineargameai.github.io/yoroll-app-components/#start) · [组件](https://lineargameai.github.io/yoroll-app-components/#components) · [App 页面索引](https://lineargameai.github.io/yoroll-app-components/#pages) · [组合](https://lineargameai.github.io/yoroll-app-components/#blocks) · [字体与字号](https://lineargameai.github.io/yoroll-app-components/#tokens/typography) · [图素](https://lineargameai.github.io/yoroll-app-components/#assets)

| 栏目 | 内容 |
| --- | --- |
| 组件 | 52 个 React Native 组件，涵盖操作、字段、导航、弹层、卡片、列表、聊天、播放与反馈 |
| App 页面索引 | 67 个路由文件，覆盖 44 个产品页面、3 个调试页、全局覆盖层及各导航和复用入口 |
| 组合示例 | 资料编辑表单、修改确认框、列表加载与空态 |
| 设计 Token | App 的深浅语义色、字族与字级、间距、控件尺寸、弹层、渐变和阴影 |
| 动效 | 时长、缓动、生命周期、系统减少动态效果和网页播放示意 |
| 图素 | App 原图下载、按风格筛选、逐图生成提示词、参考色板和可复制的延展提示词 |

设计基线取自 YorollApp `0983ce7b2`。组件与规则的 App 实现链接使用该源码版本，持有 App 仓库权限的成员可以打开。App 默认使用深色，浅色保留为预览选项。

## 在代码里使用

组件入口面向 Expo SDK 54 / React Native 0.81。通过 Git 安装时，在团队项目里将依赖固定到所选提交。使用 `YorollThemeProvider` 切换组件主题，页面容器、导航栏和弹层从宿主的 `SafeAreaProvider` 读取安全区。

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
| 布局、控件、卡片和弹层 | `controlMetrics`、`cardMetrics`、`layout`、`buttonMetrics`、`inputMetrics`、`tabMetrics`、`sheetMetrics`、`dialogMetrics`、`bottomSheetBottomPadding` |
| 字体与字号 | `typography`、`componentText`、`systemFonts`、`customFontNames`、`useTheme().fonts`、`useTheme().fontWeights` |
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

[注册表 JSON](https://lineargameai.github.io/yoroll-app-components/registry.json) 提供组件、组合示例和页面组合的文档入口。每项的 `entry` 指向入口，`files` 包含文件相对路径与原文，`dependencies` 列出源码导入的包，`peerDependencies` 列出 React Native 宿主要求。拷贝单项的实现时按清单保留相对路径。组合示例通过 `@yoroll/app-components` 引用基础组件。

[YButton 源码清单](https://lineargameai.github.io/yoroll-app-components/r/ybutton.json) · [资料表单的 TSX 和依赖](https://lineargameai.github.io/yoroll-app-components/r/profile-form.json)

## App 样式来源

`src/appStyles.ts` 由 `scripts/sync-app-styles.mjs` 从指定版本的 YorollApp 源码提取。它收录直接用在预览和组件中的配色、圆角、字级、间距、尺寸与视图样式。会员、Treats、角色卡、聊天模型与分享等组件同时使用对应的 App 图素。页面预览的文案和数据是示例，按设备和渠道变化的 App 内容仍由各自宿主提供。

页面使用 App 随附的 Geologica SemiBold 和 Bebas Neue 文件。授权文本随字体提供。[Geologica OFL](playground/fonts/OFL-Geologica.txt) · [Bebas Neue OFL](playground/fonts/OFL-BebasNeue.txt) · [Bebas Neue 官方源](https://raw.githubusercontent.com/google/fonts/main/ofl/bebasneue/OFL.txt)

```sh
npm run check:app-styles -- /absolute/path/to/YorollApp
npm run sync:app-styles -- /absolute/path/to/YorollApp
```

## 按 App 页面复用

从页面索引可以按业务、路由和组件名称查找。页面详情提供可操作的组合预览、各界面区域的组件映射、App 状态及源码位置。组件详情也可返回相关页面。

页面 TSX 清单包含入口和共享组合文件。把下载的文件按相对路径放入 React Native 工程，并在根节点配置 `SafeAreaProvider` 与 `YorollThemeProvider`。示例使用演示数据。Unity、WebView、语音通话、授权和购买由接入方的 App 宿主提供。

基线版本的页面目录保存在 `playground/app-pages.json`，共享示例保存在 `playground/examples/screens/`。可以在同一 App 版本校验路由覆盖、源码文件和行号。

```sh
npm run check:app-pages -- /absolute/path/to/YorollApp
```

## App 完整索引

在拥有 YorollApp checkout 的机器上生成索引。构建从当前 checkout 读取组件、样式、字体、素材图和动效，保留源码位置。

```sh
npm ci
npm run build:app -- /absolute/path/to/YorollApp
```

用浏览器打开本机的 `dist-app/index.html`。在 **App 索引 → 素材图库** 按名称、风格、代码引用或原始提示词查找素材，卡片会列出 App 源文件和静态引用位置。

**设计 Token → 字体与字号** 提供已核对的字体、字号、行高、字重、字距和对应 Token，本机版也能预览 App 字体文件。**App 索引 → 字体与字号** 可搜索 App 源码中的实际排版属性和表达式。索引来自静态扫描，运行时取值以对应实现为准。

完整源码索引和 App 其余字体文件保存在本机生成的 `dist-app/`。

## 公开素材图库

[图素页](https://lineargameai.github.io/yoroll-app-components/#assets) 收录 App 原图、来自 `*.prompt.json` 和 `generation-prompt*.json` 的生成提示词，以及按风格整理的延展提示词。卡片可以下载原图、逐段复制已归档的提示词或复制全部生成步骤。根据单张原图补写的内容标为「后补参考提示词」，也可以在图库筛选和复制。

图库快照在 `artwork/`。`originals/` 保留 App 文件路径和原始字节，`catalog.json` 记录源提交、图像路径和对应提示词。可从 YorollApp 的指定提交更新快照。

后补参考词保存在 `playground/artwork-reference-prompts.json`。构建根据文件路径和 SHA-256 附加到对应原图，网页及其素材 JSON 会显示参考内容。

```sh
npm run sync:artwork -- /absolute/path/to/YorollApp 0983ce7b2
```

提交更新后的 `artwork/` 即可随 GitHub Pages 构建发布。

## 开发与发布

使用 Node.js 22。

```sh
npm ci
npm run check
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

入口代码在 `src/index.ts`，主题色在 `src/tokens.ts`，排版样式在 `src/typography.ts`，尺寸与视觉参数在 `src/foundations.ts`，动效参数在 `src/motion.ts`。组件示例写在 `playground/examples/components/`，在 `playground/demos.tsx` 和 `playground/appDemos.ts` 配置名称、参数与 App 源码路径。组合示例在 `playground/examples/blocks/`，素材风格定义在 `playground/artStyles.ts`。GitHub Actions 从 `main` 发布公开构建和注册表到 GitHub Pages。
