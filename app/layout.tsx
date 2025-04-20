// 导入 Next.js App Router 适配器，用于处理 URL 查询参数状态管理库 Nuqs
import { NuqsAdapter } from "nuqs/adapters/next/app";
// 导入 Next.js 提供的 Metadata 类型，用于定义页面的元数据（比如标题、描述）
import type { Metadata } from "next";
// 导入自定义的主题提供者组件，用于管理应用的主题（例如亮色/暗色模式）
import { ThemeProvider } from "@/components/theme-provider";
// 导入 Toast 通知组件，用于显示短暂的消息提示
import { Toaster } from "@/components/ui/toaster";
// 导入 Tooltip（工具提示）提供者组件，用于启用和管理应用中的提示框
import { TooltipProvider } from "@/components/ui/tooltip";
// 导入用于注入主题切换脚本的组件，可能用于避免 FOUC (Flash of Unstyled Content)
import { ThemeScript } from "@/components/theme-script";
// 导入全局 CSS 样式文件
import "./globals.css";
// 导入 PostHog 初始化组件，PostHog 是一个产品分析工具
import { PostHogInit } from "@/components/posthog-init";
// 导入 React 的 Suspense 组件，用于处理代码分割和异步加载时的占位符（例如加载状态）
import { Suspense } from "react";

// 定义应用的元数据，这些信息会被 Next.js 用来生成 HTML 的 <head> 部分的内容
// 这对于 SEO (搜索引擎优化) 和社交媒体分享非常重要
export const metadata: Metadata = {
  // 页面标题，会显示在浏览器标签页上
  title: "Beautiful themes for shadcn/ui — tweakcn | Theme Editor & Generator",
  // 页面描述，搜索引擎会用它来了解页面内容
  description:
    "Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.",
  // 页面关键词，帮助搜索引擎分类页面内容 (虽然现在搜索引擎对 keywords 的权重降低了，但写上总比不写好)
  keywords:
    "theme editor, theme generator, shadcn, ui, components, react, tailwind, button, editor, visual editor, component editor, web development, frontend, design system, UI components, React components, Tailwind CSS, shadcn/ui themes",
  // 页面作者信息
  authors: [{ name: "Sahaj Jain" }],
  // Open Graph (OG) 协议配置，主要用于在社交媒体（如 Facebook, LinkedIn）上分享时显示丰富的预览信息
  openGraph: {
    title: // 分享时的标题
      "Beautiful themes for shadcn/ui — tweakcn | Theme Editor & Generator",
    description: // 分享时的描述
      "Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.",
    url: "https://tweakcn.com/", // 页面的规范 URL
    siteName: "tweakcn", // 网站名称
    images: [ // 分享时显示的预览图片
      {
        url: "https://tweakcn.com/og-image.png", // 图片 URL
        width: 1200, // 图片宽度
        height: 630, // 图片高度
      },
    ],
    locale: "en_US", // 内容语言区域
    type: "website", // 页面类型
  },
  // Twitter 卡片配置，用于在 Twitter 上分享时显示特定的预览样式
  twitter: {
    card: "summary_large_image", // 卡片类型，大图摘要
    title: // Twitter 分享标题
      "Beautiful themes for shadcn/ui — tweakcn | Theme Editor & Generator",
    description: // Twitter 分享描述
      "Customize theme for shadcn/ui with tweakcn's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.",
    images: ["https://tweakcn.com/og-image.png"], // Twitter 分享图片
  },
  // 爬虫指令，告诉搜索引擎可以索引 (index) 并跟踪 (follow) 页面上的链接
  robots: "index, follow",
  // 视口设置，控制页面在移动设备上的显示方式
  viewport: "width=device-width, initial-scale=1.0",
};

// 这是 Next.js App Router 中的根布局组件。
// 所有页面都会被包裹在这个布局里面。它定义了通用的 HTML 结构和全局上下文提供者。
// 就好像是给所有房间（页面）都安上了一个统一的门框和墙纸（布局和全局样式/功能）。
export default function RootLayout({
  // `children` 是一个特殊的 React prop，它代表了这个布局组件内部嵌套的内容，
  // 在 Next.js 中，这通常是当前页面 (`page.tsx`) 或嵌套的子布局 (`layout.tsx`)。
  children,
}: {
  // 使用 TypeScript 定义 `children` 的类型为 React 节点
  children: React.ReactNode;
}) {
  // 返回整个页面的 HTML 结构
  return (
    // `<html>` 根元素，`lang="en"` 指定页面语言为英语
    <html lang="en">
      {/* `<head>` 部分包含页面的元信息、引用的样式表、脚本等，通常不直接显示给用户 */}
      <head>
        {/* 注入主题切换脚本，确保在页面加载时能尽快应用正确的主题，防止闪烁 */}
        <ThemeScript />
        {/* 定义各种尺寸的网站图标 (favicon) 和苹果设备的触摸图标 */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          type="image/png"
          sizes="180x180"
        />
        {/* 链接到 Web 应用清单文件，用于 PWA (Progressive Web App) 功能 */}
        <link rel="manifest" href="/site.webmanifest" />
        {/* 预连接到 Google Fonts 服务器，可以加快字体的加载速度 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous" // 允许跨域获取字体资源
        />
        {/* 加载多种 Google 字体 */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@300..700&family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@100..900&family=Oxanium:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        {/* 添加一个 meta 标签，阻止 Dark Reader 等浏览器扩展修改页面颜色 */}
        <meta name="darkreader-lock"/>
      </head>
      {/* `<body>` 包含页面的可见内容 */}
      <body>
        {/* 使用 NuqsAdapter 包裹，为应用提供 URL 查询参数状态管理的能力 */}
        <NuqsAdapter>
          {/* Suspense 用于包裹可能需要异步加载数据的组件。
              在子组件加载完成前，可以显示一个 fallback UI (这里没有指定 fallback，所以会显示空白或默认行为)。 */}
          <Suspense>
            {/* ThemeProvider 包裹应用，提供主题切换的功能 */}
            <ThemeProvider defaultTheme="light">
              {/* TooltipProvider 包裹应用，启用 Tooltip 功能 */}
              <TooltipProvider>
                {/* Toaster 组件用于显示全局的 Toast 通知 */}
                <Toaster />
                {/* 这里渲染实际的页面内容 (`page.tsx` 或子布局) */}
                {children}
              </TooltipProvider>
            </ThemeProvider>
          </Suspense>
        </NuqsAdapter>
        {/* 初始化 PostHog 分析工具 */}
        <PostHogInit />
      </body>
    </html>
  );
}
