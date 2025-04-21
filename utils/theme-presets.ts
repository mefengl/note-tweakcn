/**
 * 主题预设管理模块
 * 
 * 这个文件就像是一个"主题商店"，包含了各种预先设计好的网站主题。
 * 想象一下，如果网站是一间屋子，这个文件就是一本装修目录册，里面有各种
 * 不同风格的装修方案可以直接选用。
 * 
 * 用户可以从这些预设中选择一个作为起点，然后根据自己的喜好进行调整。
 * 每个预设都包含了完整的主题定义，包括颜色、字体、圆角等多种设计元素，
 * 都是为明亮模式(白天)和暗黑模式(夜晚)分别设置的。
 */

import { defaultThemeState } from "../config/theme";
import { ThemePreset, ThemeStyles } from "../types/theme";

/**
 * 根据预设名称获取对应的主题样式
 * 
 * 这个函数就像是从目录册中找到你想要的那个装修方案。
 * 你只需要告诉它方案的名称，它就会把完整的方案内容返回给你。
 * 
 * 如果找不到指定名称的预设，或者指定为"default"，就会返回默认主题。
 * 
 * @param name 预设主题的名称
 * @returns 完整的主题样式对象
 */
export function getPresetThemeStyles(name: string): ThemeStyles {
  const defaultTheme = defaultThemeState.styles;
  if (name === "default") {
    return defaultTheme;
  }

  const preset = presets[name];
  if (!preset) {
    return defaultTheme;
  }

  // 合并默认主题和预设主题
  // 这样可以确保即使预设中某些设置缺失，也能使用默认值补充
  return {
    light: {
      ...defaultTheme.light,
      ...(preset.styles.light || {}),
    },
    dark: {
      ...defaultTheme.dark,
      ...(preset.styles.dark || {}),
    },
  };
}

/**
 * 预设主题集合
 * 
 * 这里定义了所有可用的主题预设，就像是装修目录册中的每一页。
 * 每个预设都有一个名称（用作对象的键）和详细的配置。
 * 
 * 每个预设包含：
 * - label: 用户友好的显示名称
 * - createdAt(可选): 创建日期
 * - styles: 主题样式定义，分为light(明亮模式)和dark(暗黑模式)
 * 
 * 每种模式下又包含多种颜色定义，如：
 * - background: 背景颜色
 * - foreground: 前景(文本)颜色
 * - primary: 主要颜色，通常用于按钮、链接等
 * - secondary: 次要颜色
 * - accent: 强调色
 * - 以及其他UI元素的颜色
 * 
 * 此外还包括字体、圆角、阴影等设计元素的定义
 */
export const presets: Record<string, ThemePreset> = {
  /**
   * 现代简约风格主题
   * 
   * 这个主题使用清新的蓝色作为主色调，整体风格简约现代。
   * 适合喜欢清爽、专业设计的用户。
   */
  "modern-minimal": {
    label: "Modern Minimal",
    styles: {
      light: {
        background: "#ffffff",
        foreground: "#333333",
        card: "#ffffff",
        "card-foreground": "#333333",
        popover: "#ffffff",
        "popover-foreground": "#333333",
        primary: "#3b82f6",
        "primary-foreground": "#ffffff",
        secondary: "#f3f4f6",
        "secondary-foreground": "#4b5563",
        muted: "#f9fafb",
        "muted-foreground": "#6b7280",
        accent: "#e0f2fe",
        "accent-foreground": "#1e3a8a",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#3b82f6",
        "chart-1": "#3b82f6",
        "chart-2": "#2563eb",
        "chart-3": "#1d4ed8",
        "chart-4": "#1e40af",
        "chart-5": "#1e3a8a",
        radius: "0.375rem",
        sidebar: "#f9fafb",
        "sidebar-foreground": "#333333",
        "sidebar-primary": "#3b82f6",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#e0f2fe",
        "sidebar-accent-foreground": "#1e3a8a",
        "sidebar-border": "#e5e7eb",
        "sidebar-ring": "#3b82f6",
        "font-sans": "Inter, sans-serif",
        "font-serif": "Source Serif 4, serif",
        "font-mono": "JetBrains Mono, monospace",
      },
      dark: {
        background: "#171717",
        foreground: "#e5e5e5",
        card: "#262626",
        "card-foreground": "#e5e5e5",
        popover: "#262626",
        "popover-foreground": "#e5e5e5",
        primary: "#3b82f6",
        "primary-foreground": "#ffffff",
        secondary: "#262626",
        "secondary-foreground": "#e5e5e5",
        muted: "#262626",
        "muted-foreground": "#a3a3a3",
        accent: "#1e3a8a",
        "accent-foreground": "#bfdbfe",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#404040",
        input: "#404040",
        ring: "#3b82f6",
        "chart-1": "#60a5fa",
        "chart-2": "#3b82f6",
        "chart-3": "#2563eb",
        "chart-4": "#1d4ed8",
        "chart-5": "#1e40af",
        radius: "0.375rem",
        sidebar: "#171717",
        "sidebar-foreground": "#e5e5e5",
        "sidebar-primary": "#3b82f6",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#1e3a8a",
        "sidebar-accent-foreground": "#bfdbfe",
        "sidebar-border": "#404040",
        "sidebar-ring": "#3b82f6",
      },
    },
  },

  /**
   * T3 聊天主题
   * 
   * 这是一个以粉紫色调为主的主题，灵感来源于T3聊天应用。
   * 适合社交、聊天类应用，给人一种友好、温暖的感觉。
   */
  "t3-chat": {
    label: "T3 Chat",
    createdAt: "2025-04-19",
    styles: {
      light: {
        background: "#faf5fa",
        foreground: "#501854",
        card: "#faf5fa",
        "card-foreground": "#501854",
        popover: "#ffffff",
        "popover-foreground": "#501854",
        primary: "#a84370",
        "primary-foreground": "#ffffff",
        secondary: "#f1c4e6",
        "secondary-foreground": "#77347c",
        muted: "#f6e5f3",
        "muted-foreground": "#834588",
        accent: "#f1c4e6",
        "accent-foreground": "#77347c",
        destructive: "#ab4347",
        "destructive-foreground": "#ffffff",
        border: "#efbdeb",
        input: "#e7c1dc",
        ring: "#db2777",
        "chart-1": "#d926a2",
        "chart-2": "#6c12b9",
        "chart-3": "#274754",
        "chart-4": "#e8c468",
        "chart-5": "#f4a462",
        sidebar: "#f3e4f6",
        "sidebar-foreground": "#ac1668",
        "sidebar-primary": "#454554",
        "sidebar-primary-foreground": "#faf1f7",
        "sidebar-accent": "#f8f8f7",
        "sidebar-accent-foreground": "#454554",
        "sidebar-border": "#eceae9",
        "sidebar-ring": "#db2777",
        radius: "0.5rem",
      },
      dark: {
        background: "#221d27",
        foreground: "#d2c4de",
        card: "#2c2632",
        "card-foreground": "#dbc5d2",
        popover: "#100a0e",
        "popover-foreground": "#f8f1f5",
        primary: "#a3004c",
        "primary-foreground": "#efc0d8",
        secondary: "#362d3d",
        "secondary-foreground": "#d4c7e1",
        muted: "#28222d",
        "muted-foreground": "#c2b6cf",
        accent: "#463753",
        "accent-foreground": "#f8f1f5",
        destructive: "#301015",
        "destructive-foreground": "#ffffff",
        border: "#3b3237",
        input: "#3e343c",
        ring: "#db2777",
        "chart-1": "#a84370",
        "chart-2": "#934dcb",
        "chart-3": "#e88c30",
        "chart-4": "#af57db",
        "chart-5": "#e23670",
        sidebar: "#181117",
        "sidebar-foreground": "#e0cad6",
        "sidebar-primary": "#1d4ed8",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#261922",
        "sidebar-accent-foreground": "#f4f4f5",
        "sidebar-border": "#000000",
        "sidebar-ring": "#db2777",
      },
    },
  },

  /**
   * 泡泡糖主题
   * 
   * 这个主题使用柔和的粉色和蓝色，就像泡泡糖的颜色一样。
   * 整体感觉活泼、可爱，适合面向年轻人的网站或应用。
   */
  bubblegum: {
    label: "Bubblegum",
    createdAt: "2025-04-18",
    styles: {
      light: {
        background: "#f6e6ee",
        foreground: "#5b5b5b",
        card: "#fdedc9",
        "card-foreground": "#5b5b5b",
        popover: "#ffffff",
        "popover-foreground": "#5b5b5b",
        primary: "#d04f99",
        "primary-foreground": "#ffffff",
        secondary: "#8acfd1",
        "secondary-foreground": "#333333",
        muted: "#b2e1eb",
        "muted-foreground": "#7a7a7a",
        accent: "#fbe2a7",
        "accent-foreground": "#333333",
        destructive: "#f96f70",
        "destructive-foreground": "#ffffff",
        border: "#d04f99",
        input: "#e4e4e4",
        ring: "#e670ab",
        "chart-1": "#e670ab",
        "chart-2": "#84d2e2",
        "chart-3": "#fbe2a7",
        "chart-4": "#f3a0ca",
        "chart-5": "#d7488e",
        sidebar: "#f8d8ea",
        "sidebar-foreground": "#333333",
        "sidebar-primary": "#ec4899",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#f9a8d4",
        "sidebar-accent-foreground": "#333333",
        "sidebar-border": "#f3e8ff",
        "sidebar-ring": "#ec4899",
        "font-sans": "Poppins, sans-serif",
        "font-serif": "Lora, serif",
        "font-mono": "Fira Code, monospace",
        radius: "0.4rem",
        "shadow-color": "hsl(325.78 58.18% 56.86% / 0.5)",
        "shadow-opacity": "1.0",
        "shadow-blur": "0px",
        "shadow-spread": "0px",
        "shadow-offset-x": "3px",
        "shadow-offset-y": "3px",
      },
      dark: {
        background: "#12242e",
        foreground: "#f3e3ea",
        card: "#1c2e38",
        "card-foreground": "#f3e3ea",
        popover: "#1c2e38",
        "popover-foreground": "#f3e3ea",
        primary: "#fbe2a7",
        "primary-foreground": "#12242e",
        secondary: "#e4a2b1",
        "secondary-foreground": "#12242e",
        muted: "#24272b",
        "muted-foreground": "#e4a2b1",
        accent: "#c67b96",
        "accent-foreground": "#f3e3ea",
        destructive: "#e35ea4",
        "destructive-foreground": "#12242e",
        border: "#324859",
        input: "#20333d",
        ring: "#50afb6",
        "chart-1": "#50afb6",
        "chart-2": "#e4a2b1",
        "chart-3": "#c67b96",
        "chart-4": "#175c6c",
        "chart-5": "#24272b",
        sidebar: "#101f28",
        "sidebar-foreground": "#f3f4f6",
        "sidebar-primary": "#ec4899",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#f9a8d4",
        "sidebar-accent-foreground": "#1f2937",
        "sidebar-border": "#374151",
        "sidebar-ring": "#ec4899",
        "font-sans": "Poppins, sans-serif",
        "font-serif": "Lora, serif",
        "font-mono": "Fira Code, monospace",
        "shadow-color": "#324859",
      },
    },
  },

  /**
   * Catppuccin主题
   * 
   * 这个主题灵感来源于同名的流行配色方案，使用柔和的柔和色调。
   * 它的颜色既舒适又有趣，广受程序员和设计师喜爱。
   */
  catppuccin: {
    label: "Catppuccin",
    createdAt: "2025-04-18",
    styles: {
      light: {
        background: "#eff1f5",
        foreground: "#4c4f69",
        card: "#ffffff",
        "card-foreground": "#4c4f69",
        popover: "#ccd0da",
        "popover-foreground": "#4c4f69",
        primary: "#8839ef",
        "primary-foreground": "#ffffff",
        secondary: "#ccd0da",
        "secondary-foreground": "#4c4f69",
        muted: "#dce0e8",
        "muted-foreground": "#6c6f85",
        accent: "#04a5e5",
        "accent-foreground": "#ffffff",
        destructive: "#d20f39",
        "destructive-foreground": "#ffffff",
        border: "#bcc0cc",
        input: "#ccd0da",
        ring: "#8839ef",
        "chart-1": "#8839ef",
        "chart-2": "#04a5e5",
        "chart-3": "#40a02b",
        "chart-4": "#fe640b",
        "chart-5": "#dc8a78",
        sidebar: "#e6e9ef",
        "sidebar-foreground": "#4c4f69",
        "sidebar-primary": "#8839ef",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#04a5e5",
        "sidebar-accent-foreground": "#ffffff",
        "sidebar-border": "#bcc0cc",
        "sidebar-ring": "#8839ef",
        "font-sans": "Montserrat, sans-serif",
        "font-serif": "Georgia, serif",
        "font-mono": "Fira Code, monospace",
        radius: "0.35rem",
        "shadow-color": "hsl(240 30% 25%)",
        "shadow-opacity": "0.12",
        "shadow-blur": "6px",
        "shadow-spread": "0px",
        "shadow-offset-x": "0px",
        "shadow-offset-y": "4px",
      },
      dark: {
        background: "#181825",
        foreground: "#cdd6f4",
        card: "#1e1e2e",
        "card-foreground": "#cdd6f4",
        popover: "#45475a",
        "popover-foreground": "#cdd6f4",
        primary: "#cba6f7",
        "primary-foreground": "#1e1e2e",
        secondary: "#585b70",
        "secondary-foreground": "#cdd6f4",
        muted: "#292c3c",
        "muted-foreground": "#a6adc8",
        accent: "#89dceb",
        "accent-foreground": "#1e1e2e",
        destructive: "#f38ba8",
        "destructive-foreground": "#1e1e2e",
        border: "#313244",
        input: "#313244",
        ring: "#cba6f7",
        "chart-1": "#cba6f7",
        "chart-2": "#89dceb",
        "chart-3": "#a6e3a1",
        "chart-4": "#fab387",
        "chart-5": "#f5e0dc",
        sidebar: "#11111b",
        "sidebar-foreground": "#cdd6f4",
        "sidebar-primary": "#cba6f7",
        "sidebar-primary-foreground": "#1e1e2e",
        "sidebar-accent": "#89dceb",
        "sidebar-accent-foreground": "#1e1e2e",
        "sidebar-border": "#45475a",
        "sidebar-ring": "#cba6f7",
      },
    },
  },

  /**
   * 石墨主题
   * 
   * 这是一个使用灰色调的简约主题，就像石墨的颜色一样。
   * 整体风格专业、沉稳，适合商务或专业类网站。
   */
  graphite: {
    label: "Graphite",
    createdAt: "2025-04-17",
    styles: {
      light: {
        background: "#f0f0f0",
        foreground: "#333333",
        card: "#f5f5f5",
        "card-foreground": "#333333",
        popover: "#f5f5f5",
        "popover-foreground": "#333333",
        primary: "#606060",
        "primary-foreground": "#ffffff",
        secondary: "#e0e0e0",
        "secondary-foreground": "#333333",
        muted: "#d9d9d9",
        "muted-foreground": "#666666",
        accent: "#c0c0c0",
        "accent-foreground": "#333333",
        destructive: "#cc3333",
        "destructive-foreground": "#ffffff",
        border: "#d0d0d0",
        input: "#e0e0e0",
        ring: "#606060",
        "chart-1": "#606060",
        "chart-2": "#476666",
        "chart-3": "#909090",
        "chart-4": "#a8a8a8",
        "chart-5": "#c0c0c0",
        sidebar: "#eaeaea",
        "sidebar-foreground": "#333333",
        "sidebar-primary": "#606060",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#c0c0c0",
        "sidebar-accent-foreground": "#333333",
        "sidebar-border": "#d0d0d0",
        "sidebar-ring": "#606060",
        "font-sans": "Montserrat, sans-serif",
        "font-serif": "Georgia, serif",
        "font-mono": "Fira Code, monospace",
        radius: "0.35rem",
        "shadow-color": "hsl(0 0% 20% / 0.1)",
        "shadow-opacity": "0.15",
        "shadow-blur": "0px",
        "shadow-spread": "0px",
        "shadow-offset-x": "0px",
        "shadow-offset-y": "2px",
      },
      dark: {
        background: "#1a1a1a",
        foreground: "#d9d9d9",
        card: "#202020",
        "card-foreground": "#d9d9d9",
        popover: "#202020",
        "popover-foreground": "#d9d9d9",
        primary: "#a0a0a0",
        "primary-foreground": "#1a1a1a",
        secondary: "#303030",
        "secondary-foreground": "#d9d9d9",
        muted: "#2a2a2a",
        "muted-foreground": "#808080",
        accent: "#404040",
        "accent-foreground": "#d9d9d9",
        destructive: "#e06666",
        "destructive-foreground": "#ffffff",
        border: "#353535",
        input: "#303030",
        ring: "#a0a0a0",
        "chart-1": "#a0a0a0",
        "chart-2": "#7e9ca0",
        "chart-3": "#707070",
        "chart-4": "#585858",
        "chart-5": "#404040",
        sidebar: "#1f1f1f",
        "sidebar-foreground": "#d9d9d9",
        "sidebar-primary": "#a0a0a0",
        "sidebar-primary-foreground": "#1a1a1a",
        "sidebar-accent": "#404040",
        "sidebar-accent-foreground": "#d9d9d9",
        "sidebar-border": "#353535",
        "sidebar-ring": "#a0a0a0",
        "font-sans": "Inter, sans-serif",
        "font-serif": "Georgia, serif",
        "font-mono": "Fira Code, monospace",
      },
    },
  },

  /**
   * 永恒主题
   * 
   * 这个主题使用青蓝色调，给人一种未来感和科技感。
   * 适合科技公司、产品展示或现代应用。
   */
  perpetuity: {
    label: "Perpetuity",
    createdAt: "2025-04-01",
    styles: {
      light: {
        background: "#e8f0f0",
        foreground: "#0a4a55",
        card: "#f2f7f7",
        "card-foreground": "#0a4a55",
        popover: "#f2f7f7",
        "popover-foreground": "#0a4a55",
        primary: "#06858e",
        "primary-foreground": "#ffffff",
        secondary: "#d9eaea",
        "secondary-foreground": "#0a4a55",
        muted: "#e0eaea",
        "muted-foreground": "#427a7e",
        accent: "#c9e5e7",
        "accent-foreground": "#0a4a55",
        destructive: "#d13838",
        "destructive-foreground": "#ffffff",
        border: "#cde0e2",
        input: "#d9eaea",
        ring: "#06858e",
        "chart-1": "#06858e",
        "chart-2": "#1e9ea6",
        "chart-3": "#37b6be",
        "chart-4": "#5dc7ce",
        "chart-5": "#8ad8dd",
        sidebar: "#daebed",
        "sidebar-foreground": "#0a4a55",
        "sidebar-primary": "#06858e",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#c9e5e7",
        "sidebar-accent-foreground": "#0a4a55",
        "sidebar-border": "#cde0e2",
        "sidebar-ring": "#06858e",
        "font-sans": "Courier New, monospace",
        "font-serif": "Courier New, monospace",
        "font-mono": "Courier New, monospace",
        radius: "0.125rem",
        "shadow-color": "hsl(185 70% 30% / 0.15)",
        "shadow-opacity": "0.15",
        "shadow-blur": "2px",
        "shadow-spread": "0px",
        "shadow-offset-x": "1px",
        "shadow-offset-y": "1px",
      },
      dark: {
        background: "#0a1a20",
        foreground: "#4de8e8",
        card: "#0c2025",
        "card-foreground": "#4de8e8",
        popover: "#0c2025",
        "popover-foreground": "#4de8e8",
        primary: "#4de8e8",
        "primary-foreground": "#0a1a20",
        secondary: "#164955",
        "secondary-foreground": "#4de8e8",
        muted: "#0f3039",
        "muted-foreground": "#36a5a5",
        accent: "#164955",
        "accent-foreground": "#4de8e8",
        destructive: "#e83c3c",
        "destructive-foreground": "#f2f2f2",
        border: "#164955",
        input: "#164955",
        ring: "#4de8e8",
        "chart-1": "#4de8e8",
        "chart-2": "#36a5a5",
        "chart-3": "#2d8a8a",
        "chart-4": "#19595e",
        "chart-5": "#0e383c",
        sidebar: "#0a1a20",
        "sidebar-foreground": "#4de8e8",
        "sidebar-primary": "#4de8e8",
        "sidebar-primary-foreground": "#0a1a20",
        "sidebar-accent": "#164955",
        "sidebar-accent-foreground": "#4de8e8",
        "sidebar-border": "#164955",
        "sidebar-ring": "#4de8e8",
        "font-sans": "Source Code Pro, monospace",
        "font-serif": "Source Code Pro, monospace",
        "font-mono": "Source Code Pro, monospace",
        radius: "0.125rem",
        "shadow-color": "hsl(180 70% 60% / 0.2)",
        "shadow-opacity": "0.2",
        "shadow-blur": "2px",
        "shadow-spread": "0px",
        "shadow-offset-x": "1px",
        "shadow-offset-y": "1px",
      },
    },
  },
  /**
   * 木灵之森主题
   * 
   * 这个主题使用自然的绿色和棕色，就像森林中的颜色一样。
   * 给人一种宁静、自然的感觉，适合环保、自然类主题的网站。
   */
  "kodama-grove": {
    label: "Kodama Grove",
    styles: {
      light: {
        background: "#e4d7b0",
        foreground: "#5c4b3e",
        card: "#e7dbbf",
        "card-foreground": "#5c4b3e",
        popover: "#f3ead2",
        "popover-foreground": "#5c4b3e",
        primary: "#8d9d4f",
        "primary-foreground": "#fdfbf6",
        secondary: "#decea0",
        "secondary-foreground": "#5c4b3e",
        muted: "#decea0",
        "muted-foreground": "#85766a",
        accent: "#dbc894",
        "accent-foreground": "#5c4b3e",
        destructive: "#d98b7e",
        "destructive-foreground": "#faf8f2",
        border: "#b19681",
        input: "#dbc894",
        ring: "#9db18c",
        "chart-1": "#9db18c",
        "chart-2": "#8a9f7b",
        "chart-3": "#bac9b4",
        "chart-4": "#71856a",
        "chart-5": "#5e6e58",
        sidebar: "#e2d1a2",
        "sidebar-foreground": "#5c4b3e",
        "sidebar-primary": "#9db18c",
        "sidebar-primary-foreground": "#fdfbf6",
        "sidebar-accent": "#eae5d9",
        "sidebar-accent-foreground": "#5c4b3e",
        "sidebar-border": "#e5e0d4",
        "sidebar-ring": "#9db18c",
        "font-sans": "Merriweather, serif",
        "font-serif": "Source Serif 4, serif",
        "font-mono": "JetBrains Mono, monospace",
        radius: "0.425rem",
        "shadow-color": "hsl(88 22% 35% / 0.15)",
        "shadow-opacity": "0.15",
        "shadow-blur": "2px",
        "shadow-spread": "0px",
        "shadow-offset-x": "3px",
        "shadow-offset-y": "3px",
      },
      dark: {
        background: "#3a3529",
        foreground: "#ede4d4",
        card: "#413c33",
        "card-foreground": "#ede4d4",
        popover: "#413c33",
        "popover-foreground": "#ede4d4",
        primary: "#8a9f7b",
        "primary-foreground": "#2a2521",
        secondary: "#5a5345",
        "secondary-foreground": "#ede4d4",
        muted: "#4a4439",
        "muted-foreground": "#a8a096",
        accent: "#a18f5c",
        "accent-foreground": "#2a2521",
        destructive: "#b5766a",
        "destructive-foreground": "#f0e9db",
        border: "#5a5345",
        input: "#5a5345",
        ring: "#8a9f7b",
        "chart-1": "#8a9f7b",
        "chart-2": "#9db18c",
        "chart-3": "#71856a",
        "chart-4": "#a18f5c",
        "chart-5": "#5e6e58",
        sidebar: "#3a3529",
        "sidebar-foreground": "#ede4d4",
        "sidebar-primary": "#8a9f7b",
        "sidebar-primary-foreground": "#2a2521",
        "sidebar-accent": "#a18f5c",
        "sidebar-accent-foreground": "#2a2521",
        "sidebar-border": "#5a5345",
        "sidebar-ring": "#8a9f7b",
      },
    },
  },
};
