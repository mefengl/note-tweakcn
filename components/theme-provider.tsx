/**
 * 主题提供者组件
 * 
 * 这个组件负责：
 * 1. 管理全局主题状态（亮色/暗色模式）
 * 2. 应用主题样式到 DOM
 * 3. 处理主题切换动画
 * 4. 提供主题相关的 Context
 */

"use client";

import { createContext, useContext, useEffect } from "react";
import { useEditorStore } from "../store/editor-store";
import { colorFormatter } from "../utils/color-converter";
import { setShadowVariables } from "@/utils/shadows";
import { applyStyleToElement } from "@/utils/apply-style-to-element";
import { ThemeStyleProps, ThemeStyles } from "@/types/theme";
import { useThemePresetFromUrl } from "@/hooks/use-theme-preset-from-url";
import { COMMON_STYLES } from "@/config/theme";

// 主题类型定义
type Theme = "dark" | "light";

// 组件属性类型
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

// 坐标类型（用于主题切换动画）
type Coords = { x: number; y: number };

// Context 状态类型
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (coords?: Coords) => void;
};

// 非颜色相关的通用样式键
const COMMON_NON_COLOR_KEYS = COMMON_STYLES;

// Context 初始状态
const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
};

// 创建主题 Context
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * 辅助函数：应用通用样式
 * 将非颜色相关的样式（如边框圆角、间距等）应用到根元素
 */
const applyCommonStyles = (root: HTMLElement, themeStyles: ThemeStyleProps) => {
  Object.entries(themeStyles)
    .filter(([key]) =>
      COMMON_NON_COLOR_KEYS.includes(key as (typeof COMMON_NON_COLOR_KEYS)[number])
    )
    .forEach(([key, value]) => {
      if (typeof value === "string") {
        applyStyleToElement(root, key, value);
      }
    });
};

/**
 * 辅助函数：应用主题颜色
 * 将颜色相关的样式变量应用到根元素
 * 会自动转换颜色格式到 HSL
 */
const applyThemeColors = (
  root: HTMLElement,
  themeStyles: ThemeStyles,
  mode: Theme
) => {
  Object.entries(themeStyles[mode]).forEach(([key, value]) => {
    if (
      typeof value === "string" &&
      !COMMON_NON_COLOR_KEYS.includes(key as (typeof COMMON_NON_COLOR_KEYS)[number])
    ) {
      const hslValue = colorFormatter(value, "hsl", "4");
      applyStyleToElement(root, key, hslValue);
    }
  });
};

/**
 * 辅助函数：更新主题类名
 * 在根元素上添加/移除 dark 类
 */
const updateThemeClass = (root: HTMLElement, mode: Theme) => {
  if (mode === "light") {
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
  }
};

/**
 * 主题提供者组件
 * 管理并提供全局主题状态
 * 
 * @component
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { themeState, setThemeState } = useEditorStore();

  // 处理 URL 中的主题预设
  useThemePresetFromUrl();

  // 当主题状态改变时更新 DOM
  useEffect(() => {
    const root = window.document.documentElement;
    const { currentMode: mode, styles: themeStyles } = themeState;

    updateThemeClass(root, mode);
    applyCommonStyles(root, themeStyles.light);
    applyThemeColors(root, themeStyles, mode);
    setShadowVariables(themeState);
  }, [themeState]);

  /**
   * 处理主题模式变更
   */
  const handleThemeChange = (newMode: Theme) => {
    setThemeState({ ...themeState, currentMode: newMode });
  };

  /**
   * 处理主题切换
   * 支持平滑过渡动画，使用 View Transitions API
   * 如果浏览器不支持或用户选择减少动画，则直接切换
   */
  const handleThemeToggle = (coords?: Coords) => {
    const root = document.documentElement;
    const newMode = themeState.currentMode === "light" ? "dark" : "light";

    // 检查用户是否倾向减少动画
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 如果不支持视图过渡或用户倾向减少动画，直接切换
    if (!document.startViewTransition || prefersReducedMotion) {
      handleThemeChange(newMode);
      return;
    }

    // 设置动画起始点（如果提供了坐标）
    if (coords) {
      root.style.setProperty("--x", `${coords.x}px`);
      root.style.setProperty("--y", `${coords.y}px`);
    }

    // 使用视图过渡 API 实现平滑切换
    document.startViewTransition(() => {
      handleThemeChange(newMode);
    });
  };

  // 准备要提供给 Context 的值
  const value: ThemeProviderState = {
    theme: themeState.currentMode,
    setTheme: handleThemeChange,
    toggleTheme: handleThemeToggle,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * 主题 Hook
 * 用于在组件中访问和控制主题
 * 
 * @hook
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme();
 *   return (
 *     <button onClick={() => toggleTheme()}>
 *       当前主题: {theme}
 *     </button>
 *   );
 * }
 * ```
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
