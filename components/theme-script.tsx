/**
 * 主题初始化脚本组件
 * 
 * 这个组件的作用是在页面加载时立即执行主题初始化，
 * 避免页面闪烁（Flash of Unstyled Content，FOUC）。
 * 
 * 工作流程：
 * 1. 尝试从 localStorage 读取之前保存的主题状态
 * 2. 如果没有保存的状态，则根据系统主题偏好选择默认主题
 * 3. 将主题样式变量应用到根元素
 * 
 * 这个脚本会在 React 水合（hydration）之前执行，
 * 确保页面一开始就应用了正确的主题。
 */

"use client";

import { defaultDarkThemeStyles, defaultLightThemeStyles } from "@/config/theme";

export function ThemeScript() {
  // 创建一个立即执行函数表达式（IIFE）的脚本内容
  const scriptContent = `
    (function() {
      /**
       * 常量定义
       */
      const storageKey = "editor-storage";  // localStorage 中存储主题状态的键名
      const root = document.documentElement; // 文档根元素（用于应用 CSS 变量）
      const defaultLightStyles = ${JSON.stringify(defaultLightThemeStyles)}; // 默认亮色主题样式
      const defaultDarkStyles = ${JSON.stringify(defaultDarkThemeStyles)};   // 默认暗色主题样式

      /**
       * 从 localStorage 获取保存的主题状态
       */
      let themeState = null;
      try {
        const persistedStateJSON = localStorage.getItem(storageKey);
        if (persistedStateJSON) {
          themeState = JSON.parse(persistedStateJSON)?.state?.themeState;
        }
      } catch (e) {
        console.warn("主题初始化：读取/解析 localStorage 失败:", e);
      }

      /**
       * 确定当前应该使用的主题模式
       * 1. 优先使用保存的主题状态
       * 2. 如果没有保存的状态，则使用系统主题偏好
       */
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const mode = themeState?.currentMode ?? (prefersDark ? "dark" : "light");

      /**
       * 根据当前模式选择要应用的样式
       * 1. 优先使用保存的主题样式
       * 2. 如果没有保存的样式，则使用默认样式
       */
      const activeStyles =
        mode === "dark"
          ? themeState?.styles?.dark || defaultDarkStyles
          : themeState?.styles?.light || defaultLightStyles;

      /**
       * 获取所有需要应用的样式名称
       * 使用默认亮色主题的键作为基准
       */
      const stylesToApply = Object.keys(defaultLightStyles);

      /**
       * 将样式变量应用到根元素
       * 遍历所有样式名称，将对应的值设置为 CSS 变量
       */
      for (const styleName of stylesToApply) {
        const value = activeStyles[styleName];
        if (value !== undefined) {
          root.style.setProperty(\`--\${styleName}\`, value);
        }
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      // 禁止 React 对这个脚本的水合警告
      // 这是必要的，因为这个脚本需要在客户端和服务器端都运行
      suppressHydrationWarning
    />
  );
}
