// 指示这是一个客户端组件，意味着它可以在浏览器中运行 JavaScript
"use client";

// 导入 React 的钩子函数，用于状态管理和副作用处理
import { useEffect, useState } from "react";
// 导入构成主页的各个组件
import { Header } from "@/components/home/header"; // 页面顶部导航栏
import { Hero } from "@/components/home/hero"; // 页面主要介绍区域（英雄区域）
import { ThemePresetSelector } from "@/components/home/theme-preset-selector"; // 主题预设选择器
import { Features } from "@/components/home/features"; // 功能特性展示区
import { HowItWorks } from "@/components/home/how-it-works"; // 工作原理介绍区
import { Roadmap } from "@/components/home/roadmap"; // 项目路线图展示区
import { FAQ } from "@/components/home/faq"; // 常见问题解答区
import { CTA } from "@/components/home/cta"; // 行动号召（Call to Action）区
import { Footer } from "@/components/home/footer"; // 页面底部

// 定义并导出主页组件
export default function Home() {
  // 使用 useState 钩子创建状态变量 isScrolled
  // 它用于跟踪页面是否已经向下滚动了一定距离
  // 初始值为 false (未滚动)
  const [isScrolled, setIsScrolled] = useState(false);
  // 使用 useState 钩子创建状态变量 mobileMenuOpen
  // 它用于跟踪移动设备上的菜单是否打开
  // 初始值为 false (菜单关闭)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 使用 useEffect 钩子处理副作用，这里是监听滚动事件
  useEffect(() => {
    // 定义滚动事件的处理函数
    const handleScroll = () => {
      // 检查窗口垂直滚动的距离 (window.scrollY)
      if (window.scrollY > 10) {
        // 如果滚动距离超过 10 像素，设置 isScrolled 状态为 true
        setIsScrolled(true);
      } else {
        // 否则，设置 isScrolled 状态为 false
        setIsScrolled(false);
      }
    };

    // 在窗口上添加滚动事件监听器，并指定 handleScroll 为处理函数
    window.addEventListener("scroll", handleScroll);
    // useEffect 返回一个清理函数
    // 这个函数会在组件卸载时执行，用于移除事件监听器，防止内存泄漏
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // 空依赖数组 [] 表示这个 effect 只在组件首次挂载时运行一次

  // 返回页面的 JSX 结构
  return (
    // 最外层的 div，设置 flex 布局、最小高度为视口高度、内容居中等样式
    // bg-background 和 text-foreground 使用了 Tailwind CSS 的主题变量来设置背景和文字颜色
    <div className="flex min-h-[100dvh] justify-items-center items-center flex-col bg-background text-foreground">
      {/* 渲染 Header 组件，并传入滚动状态和移动菜单状态及其设置函数 */}
      <Header
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {/* 主体内容区域 */}
      <main className="flex-1"> {/* flex-1 让 main 区域占据剩余空间 */}
        {/* 渲染 Hero 组件 */}
        <Hero />
        {/* 渲染主题预设选择器组件 */}
        <ThemePresetSelector />
        {/* 渲染功能特性展示组件 */}
        <Features />
        {/* 渲染工作原理介绍组件 */}
        <HowItWorks />
        {/* 渲染路线图组件 */}
        <Roadmap />
        {/* 渲染常见问题解答组件 */}
        <FAQ />
        {/* 渲染行动号召组件 */}
        <CTA />
      </main>
      {/* 渲染 Footer 组件 */}
      <Footer />
    </div>
  );
}
