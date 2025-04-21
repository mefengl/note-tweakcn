## 代码阅读推荐顺序

了解项目整体结构和入口点：

* [`README.md`](./README.md) (了解项目目标和基本设置)
* [`package.json`](./package.json) (查看项目依赖和脚本)
* [`next.config.ts`](./next.config.ts) (Next.js 配置)
* [`tsconfig.json`](./tsconfig.json) (TypeScript 配置)
* [`app/layout.tsx`](./app/layout.tsx) (全局布局)
* [`app/page.tsx`](./app/page.tsx) (主页 - 可能是登陆/信息页)
* [`app/editor/theme/page.tsx`](./app/editor/theme/page.tsx) (编辑器页面入口)

核心主题和编辑器逻辑：

* [`config/theme.ts`](./config/theme.ts) (基础主题配置)
* [`config/editors/theme.ts`](./config/editors/theme.ts) (编辑器特定主题配置)
* [`types/theme.ts`](./types/theme.ts) (主题相关的类型定义)
* [`types/editor.ts`](./types/editor.ts) (编辑器相关的类型定义)
* [`store/editor-store.ts`](./store/editor-store.ts) (编辑器状态管理)
* [`store/preferences-store.ts`](./store/preferences-store.ts) (用户偏好状态管理)
* [`components/editor/editor.tsx`](./components/editor/editor.tsx) (核心编辑器组件)
* [`components/editor/theme-control-panel.tsx`](./components/editor/theme-control-panel.tsx) (主题控制面板 UI)
* [`components/editor/theme-preview-panel.tsx`](./components/editor/theme-preview-panel.tsx) (主题预览面板 UI)
* [`components/editor/action-bar.tsx`](./components/editor/action-bar.tsx) (编辑器操作栏)
* [`components/editor/header.tsx`](./components/editor/header.tsx) (编辑器页眉)
* [`components/editor/code-panel.tsx`](./components/editor/code-panel.tsx) (代码输出面板)
* [`components/editor/css-import-dialog.tsx`](./components/editor/css-import-dialog.tsx) (CSS导入对话框)
* [`utils/theme-style-generator.ts`](./utils/theme-style-generator.ts) (生成主题CSS的逻辑)
* [`utils/theme-presets.ts`](./utils/theme-presets.ts) (预设主题处理)
* [`utils/parse-css-input.ts`](./utils/parse-css-input.ts) (解析用户输入的CSS)
* [`utils/color-converter.ts`](./utils/color-converter.ts) (颜色转换工具)
* [`utils/contrast-checker.ts`](./utils/contrast-checker.ts) (对比度检查工具)
* 自定义 Hooks：
  * [`hooks/use-contrast-checker.ts`](./hooks/use-contrast-checker.ts) (对比度检查 Hook)
  * [`hooks/use-fullscreen.ts`](./hooks/use-fullscreen.ts) (全屏 Hook)
  * [`hooks/use-github-stars.ts`](./hooks/use-github-stars.ts) (获取 GitHub 星标 Hook)
  * [`hooks/use-mobile.tsx`](./hooks/use-mobile.tsx) (移动端检测 Hook)
  * [`hooks/use-theme-preset-from-url.ts`](./hooks/use-theme-preset-from-url.ts) (从 URL 获取主题预设 Hook)
  * [`hooks/use-toast.ts`](./hooks/use-toast.ts) (Toast 通知 Hook)
* [`utils/`](./utils/)* (其他工具函数 - 浏览内部文件)

通用组件和工具：

* [`components/ui/`](./components/ui/) (Shadcn UI 基础组件 - 浏览内部文件)
* [`components/theme-provider.tsx`](./components/theme-provider.tsx) (全局主题提供者)
* [`components/theme-script.tsx`](./components/theme-script.tsx) (用于主题切换的脚本)
* [`lib/utils.ts`](./lib/utils.ts) (通用工具函数)

示例和展示组件 (可选深入研究)：

* [`components/examples/`](./components/examples/) (各种使用 Shadcn UI 的示例组件 - 浏览内部文件)
* [`components/home/`](./components/home/) (主页特定组件 - 浏览内部文件)

其他配置和脚本：

* [`postcss.config.mjs`](./postcss.config.mjs) (PostCSS 配置)
* [`eslint.config.mjs`](./eslint.config.mjs) (ESLint 配置)
* [`scripts/generate-theme-registry.ts`](./scripts/generate-theme-registry.ts) (生成主题注册表的脚本)

<div align="center">
  <h1>tweakcn.com</h1>
</div>

<div align="center">
  <a href="https://discord.gg/Phs4u2NM3n" target="_blank">
    <img alt="Discord" src="https://img.shields.io/discord/1353416868769173576?style=for-the-badge&logo=discord&logoColor=%23ffffff">
  </a>
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/jnsahaj/tweakcn?style=for-the-badge&logo=github">
  <a href="https://x.com/iamsahaj_xyz">
    <img alt="X (formerly Twitter) URL" src="https://img.shields.io/twitter/url?url=https%3A%2F%2Fx.com%2Fiamsahaj_xyz&style=for-the-badge&logo=x&label=%40iamsahaj_xyz&color=%2300000000" />
  </a>
</div>

<br />

**[tweakcn](https://tweakcn.com)** is a powerful Visual Theme Editor for tailwind CSS & shadcn/ui components. It comes with Beautiful theme presets to get started, while aiming to offer advanced customisation for each aspect of your UI

![tweakcn.com](public/og-image.png)

## Motivation

Websites made with shadcn/ui famously look the same. tweakcn is a tool that helps you customize shadcn/ui components visually, to make your components stand-out.
Currently in beta, starting with a Tailwind CSS theme editor. Support for all other shadcn/ui components is planned.

## Current Features

You can find the full feature list here: https://tweakcn.com/#features

## Roadmap

You can find the updated roadmap here: https://tweakcn.com/#roadmap

## Run Locally

### Prerequisites

* Node.js 18+
* npm / yarn / pnpm

### Installation

1. Clone the repository:

    ```bash

git clone https://github.com/jnsahaj/tweakcn.git
cd tweakcn

```

2.  Install dependencies:

    ```bash
npm install
```

3. Start the development server:

    ```bash

npm run dev

```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributors

<a href="https://github.com/jnsahaj/tweakcn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=jnsahaj/tweakcn" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

### Interested in Contributing?

Contributions are welcome! Please feel free to submit a Pull Request.

# Star History

<p align="center">
  <a target="_blank" href="https://star-history.com/#jnsahaj/tweakcn&Date">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=jnsahaj/tweakcn&type=Date&theme=dark">
      <img alt="GitHub Star History for jnsahaj/tweakcn" src="https://api.star-history.com/svg?repos=jnsahaj/tweakcn&type=Date">
    </picture>
  </a>
</p>
