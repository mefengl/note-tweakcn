/**
 * 主题注册表生成脚本
 * 
 * 这个脚本的主要功能是生成 shadcn/ui 主题注册表文件。它会：
 * 1. 将项目中定义的主题转换为 shadcn/ui 期望的格式
 * 2. 处理颜色值的转换（从 HSL 到 OKLCH 颜色空间）
 * 3. 为亮色和暗色模式生成完整的主题配置
 * 4. 生成并保存最终的主题注册文件
 */

import { ThemeStyles, ThemeStyleProps } from "@/types/theme";
import { getPresetThemeStyles, presets } from "@/utils/theme-presets";
import fs from "fs";
import path from "path";
import { colorFormatter } from "@/utils/color-converter";
import {
  defaultDarkThemeStyles,
  defaultLightThemeStyles,
} from "@/config/theme";
import { getShadowMap } from "@/utils/shadows";

/**
 * 主题文件存储目录
 * 位于项目的 public/r/themes 目录下
 * 这个位置允许主题文件通过 HTTP 请求访问
 */
const THEMES_DIR = path.join(process.cwd(), "public", "r", "themes");

// 确保主题目录存在，如果不存在则创建
if (!fs.existsSync(THEMES_DIR)) {
  fs.mkdirSync(THEMES_DIR, { recursive: true });
}

/**
 * 将 HSL 颜色值转换为 shadcn 注册表期望的格式
 * 
 * @param color - HSL 格式的颜色值
 * @returns OKLCH 格式的颜色值
 * 
 * OKLCH 是一个新的颜色空间，它提供：
 * - 更好的感知均匀性
 * - 更广的颜色范围
 * - 更准确的颜色表示
 */
const convertToRegistryColor = (color: string): string => {
  return colorFormatter(color, "oklch");
};

/**
 * 从亮色或暗色主题中获取指定属性的值
 * 
 * @param dark - 暗色主题配置
 * @param light - 亮色主题配置
 * @param key - 要获取的属性名
 * @returns 属性值，优先使用暗色主题的值
 */
const getThemeValue = (
  dark: ThemeStyleProps,
  light: ThemeStyleProps,
  key: keyof ThemeStyleProps
): string => {
  return dark[key] || light[key] || "";
};

/**
 * 将主题样式转换为注册表格式
 * 
 * @param styles - 包含亮色和暗色主题的原始样式
 * @returns 转换后的注册表格式主题
 * 
 * 转换过程包括：
 * 1. 分别处理亮色和暗色主题
 * 2. 将所有颜色值转换为 OKLCH 格式
 * 3. 合并默认主题样式
 * 
 * 支持的颜色变量包括：
 * - 基础色：background, foreground
 * - 组件色：card, popover, primary, secondary, accent
 * - 功能色：destructive, muted
 * - 图表色：chart-1 到 chart-5
 * - 侧边栏色：sidebar 相关变量
 */
const convertThemeStyles = (styles: ThemeStyles) => {
  const { light, dark } = styles;

  const convertTheme = (theme: ThemeStyleProps): ThemeStyleProps => {
    const result: ThemeStyleProps = theme;
    const convertColor = (color?: string) =>
      convertToRegistryColor(color || "");

    // 转换所有颜色值为 OKLCH 格式
    result.background = convertColor(theme.background);
    result.foreground = convertColor(theme.foreground);
    result.card = convertColor(theme.card);
    result["card-foreground"] = convertColor(theme["card-foreground"]);
    result.popover = convertColor(theme.popover);
    result["popover-foreground"] = convertColor(theme["popover-foreground"]);
    result.primary = convertColor(theme.primary);
    result["primary-foreground"] = convertColor(theme["primary-foreground"]);
    result.secondary = convertColor(theme.secondary);
    result["secondary-foreground"] = convertColor(
      theme["secondary-foreground"]
    );
    result.muted = convertColor(theme.muted);
    result["muted-foreground"] = convertColor(theme["muted-foreground"]);
    result.accent = convertColor(theme.accent);
    result["accent-foreground"] = convertColor(theme["accent-foreground"]);
    result.destructive = convertColor(theme.destructive);
    result["destructive-foreground"] = convertColor(
      theme["destructive-foreground"]
    );
    result.border = convertColor(theme.border);
    result.input = convertColor(theme.input);
    result.ring = convertColor(theme.ring);
    result["chart-1"] = convertColor(theme["chart-1"]);
    result["chart-2"] = convertColor(theme["chart-2"]);
    result["chart-3"] = convertColor(theme["chart-3"]);
    result["chart-4"] = convertColor(theme["chart-4"]);
    result["chart-5"] = convertColor(theme["chart-5"]);
    result.sidebar = convertColor(theme.sidebar);
    result["sidebar-foreground"] = convertColor(theme["sidebar-foreground"]);
    result["sidebar-primary"] = convertColor(theme["sidebar-primary"]);
    result["sidebar-primary-foreground"] = convertColor(
      theme["sidebar-primary-foreground"]
    );
    result["sidebar-accent"] = convertColor(theme["sidebar-accent"]);
    result["sidebar-accent-foreground"] = convertColor(
      theme["sidebar-accent-foreground"]
    );
    result["sidebar-border"] = convertColor(theme["sidebar-border"]);
    result["sidebar-ring"] = convertColor(theme["sidebar-ring"]);

    return result;
  };

  // 合并默认样式和转换后的主题
  return {
    light: { ...defaultLightThemeStyles, ...convertTheme(light) },
    dark: { ...defaultDarkThemeStyles, ...convertTheme(dark) },
  };
};

/**
 * 生成指定主题的注册表配置
 * 
 * @param name - 主题名称
 * 
 * 处理步骤：
 * 1. 获取并转换主题样式
 * 2. 为亮色和暗色模式生成阴影配置
 * 3. 生成最终的主题配置对象
 */
const generateThemeRegistry = (name: string) => {
  // 获取并转换主题样式
  const { light, dark } = convertThemeStyles(getPresetThemeStyles(name));

  // 为亮色和暗色模式生成阴影变量
  const lightShadows = getShadowMap({
    styles: { light, dark },
    currentMode: "light",
  });
  const darkShadows = getShadowMap({
    styles: { light, dark },
    currentMode: "dark",
  });

  // 构建注册表项
  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:style",
    dependencies: [],
    registryDependencies: [],
    css: {
      "@layer base": {
        body: {
          "letter-spacing": "var(--tracking-normal)",
        },
      },
    },
    cssVars: {
      theme: {
        "font-sans":
          getThemeValue(dark, light, "font-sans") || "Inter, sans-serif",
        "font-mono": getThemeValue(dark, light, "font-mono") || "monospace",
        "font-serif": getThemeValue(dark, light, "font-serif") || "serif",
        radius: getThemeValue(dark, light, "radius") || "0.5rem",
        "tracking-tighter": "calc(var(--tracking-normal) - 0.05em)",
        "tracking-tight": "calc(var(--tracking-normal) - 0.025em)",
        "tracking-wide": "calc(var(--tracking-normal) + 0.025em)",
        "tracking-wider": "calc(var(--tracking-normal) + 0.05em)",
        "tracking-widest": "calc(var(--tracking-normal) + 0.1em)",
      },
      light: {
        ...light,
        "shadow-2xs": lightShadows["shadow-2xs"],
        "shadow-xs": lightShadows["shadow-xs"],
        "shadow-sm": lightShadows["shadow-sm"],
        shadow: lightShadows["shadow"],
        "shadow-md": lightShadows["shadow-md"],
        "shadow-lg": lightShadows["shadow-lg"],
        "shadow-xl": lightShadows["shadow-xl"],
        "shadow-2xl": lightShadows["shadow-2xl"],
        "tracking-normal":
          getThemeValue(dark, light, "letter-spacing") || "0em",
        spacing: getThemeValue(dark, light, "spacing") || "0.25rem",
      },
      dark: {
        ...dark,
        "shadow-2xs": darkShadows["shadow-2xs"],
        "shadow-xs": darkShadows["shadow-xs"],
        "shadow-sm": darkShadows["shadow-sm"],
        shadow: darkShadows["shadow"],
        "shadow-md": darkShadows["shadow-md"],
        "shadow-lg": darkShadows["shadow-lg"],
        "shadow-xl": darkShadows["shadow-xl"],
        "shadow-2xl": darkShadows["shadow-2xl"],
      },
    },
  };

  return registryItem;
};

/**
 * 为所有预设主题生成注册表文件
 * 
 * 遍历项目中定义的所有主题预设，生成对应的注册表文件并保存到主题目录中
 */
Object.keys(presets).forEach((name) => {
  const registryItem = generateThemeRegistry(name);
  const filePath = path.join(THEMES_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(registryItem, null, 2));
  console.log(`Generated registry file for theme: ${name}`);
});
