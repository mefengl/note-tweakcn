/**
 * 主题样式生成器
 * 
 * 这个文件负责生成网站的主题CSS代码。想象一下我们在装修一个房子，这个工具就像一个
 * 能够根据你选择的颜色、字体和其他设计元素，自动生成完整装修方案的魔法工具。
 * 
 * 它的主要功能是：
 * 1. 根据用户在编辑器中设置的主题值，生成对应的CSS变量
 * 2. 支持明亮模式(light)和暗黑模式(dark)的主题切换
 * 3. 处理颜色、字体、圆角、阴影等多种设计元素
 * 4. 支持不同颜色格式(如HSL, RGB, HEX)的输出
 * 5. 兼容Tailwind CSS v3和v4的不同格式要求
 * 
 * 这个文件是主题定制系统的核心，它把用户在界面上的操作转换为实际可用的CSS代码。
 */

import { ThemeEditorState, ThemeStyles } from "@/types/theme";
import { colorFormatter } from "./color-converter";
import { ColorFormat } from "../types";
import { getShadowMap } from "./shadows";
import { defaultLightThemeStyles } from "@/config/theme";

// 主题模式类型：明亮或暗黑
type ThemeMode = "light" | "dark";

/**
 * 生成颜色相关的CSS变量
 * 
 * 这个函数接收主题样式、模式和颜色格式化函数，然后生成所有颜色相关的CSS变量。
 * 
 * 就像是把你选择的所有颜色（如主色、背景色、文字颜色等）都整理成一个清单，
 * 并用CSS变量的形式表达出来，以便网站可以使用。
 * 
 * @param themeStyles 主题样式对象，包含所有颜色值
 * @param mode 主题模式（明亮或暗黑）
 * @param formatColor 一个函数，用于将颜色值格式化为期望的格式
 * @returns 包含所有颜色CSS变量的字符串
 */
const generateColorVariables = (
  themeStyles: ThemeStyles,
  mode: ThemeMode,
  formatColor: (color: string) => string
): string => {
  const styles = themeStyles[mode];
  return `
  --background: ${formatColor(styles.background)};
  --foreground: ${formatColor(styles.foreground)};
  --card: ${formatColor(styles.card)};
  --card-foreground: ${formatColor(styles["card-foreground"])};
  --popover: ${formatColor(styles.popover)};
  --popover-foreground: ${formatColor(styles["popover-foreground"])};
  --primary: ${formatColor(styles.primary)};
  --primary-foreground: ${formatColor(styles["primary-foreground"])};
  --secondary: ${formatColor(styles.secondary)};
  --secondary-foreground: ${formatColor(styles["secondary-foreground"])};
  --muted: ${formatColor(styles.muted)};
  --muted-foreground: ${formatColor(styles["muted-foreground"])};
  --accent: ${formatColor(styles.accent)};
  --accent-foreground: ${formatColor(styles["accent-foreground"])};
  --destructive: ${formatColor(styles.destructive)};
  --destructive-foreground: ${formatColor(styles["destructive-foreground"])};
  --border: ${formatColor(styles.border)};
  --input: ${formatColor(styles.input)};
  --ring: ${formatColor(styles.ring)};
  --chart-1: ${formatColor(styles["chart-1"])};
  --chart-2: ${formatColor(styles["chart-2"])};
  --chart-3: ${formatColor(styles["chart-3"])};
  --chart-4: ${formatColor(styles["chart-4"])};
  --chart-5: ${formatColor(styles["chart-5"])};
  --sidebar: ${formatColor(styles.sidebar)};
  --sidebar-foreground: ${formatColor(styles["sidebar-foreground"])};
  --sidebar-primary: ${formatColor(styles["sidebar-primary"])};
  --sidebar-primary-foreground: ${formatColor(styles["sidebar-primary-foreground"])};
  --sidebar-accent: ${formatColor(styles["sidebar-accent"])};
  --sidebar-accent-foreground: ${formatColor(styles["sidebar-accent-foreground"])};
  --sidebar-border: ${formatColor(styles["sidebar-border"])};
  --sidebar-ring: ${formatColor(styles["sidebar-ring"])};`;
};

/**
 * 生成字体相关的CSS变量
 * 
 * 这个函数设置网站使用的三种字体类型：无衬线字体(sans)、衬线字体(serif)和等宽字体(mono)。
 * 
 * 字体就像是文字的"服装"，不同类型的字体可以传达不同的风格和情感。
 * - 无衬线字体(sans-serif)：干净现代，适合屏幕阅读
 * - 衬线字体(serif)：传统优雅，适合长文本
 * - 等宽字体(monospace)：每个字符宽度相同，适合代码显示
 * 
 * @param themeStyles 主题样式对象
 * @param mode 主题模式
 * @returns 字体CSS变量字符串
 */
const generateFontVariables = (
  themeStyles: ThemeStyles,
  mode: ThemeMode
): string => {
  const styles = themeStyles[mode];
  return `
  --font-sans: ${styles["font-sans"]};
  --font-serif: ${styles["font-serif"]};
  --font-mono: ${styles["font-mono"]};`;
};

/**
 * 生成阴影相关的CSS变量
 * 
 * 阴影可以让UI元素看起来有立体感，就像现实世界中的物体会投下阴影一样。
 * 不同大小的阴影可以表示元素的不同高度或重要性，从微妙的阴影(2xs)到非常明显的阴影(2xl)。
 * 
 * @param shadowMap 包含不同阴影大小的对象
 * @returns 阴影CSS变量字符串
 */
const generateShadowVariables = (shadowMap: Record<string, string>): string => {
  return `
  --shadow-2xs: ${shadowMap["shadow-2xs"]};
  --shadow-xs: ${shadowMap["shadow-xs"]};
  --shadow-sm: ${shadowMap["shadow-sm"]};
  --shadow: ${shadowMap["shadow"]};
  --shadow-md: ${shadowMap["shadow-md"]};
  --shadow-lg: ${shadowMap["shadow-lg"]};
  --shadow-xl: ${shadowMap["shadow-xl"]};
  --shadow-2xl: ${shadowMap["shadow-2xl"]};`;
};

/**
 * 生成字母间距(tracking)相关的CSS变量
 * 
 * 字母间距控制文字中每个字母之间的空间，可以影响文本的可读性和视觉感受。
 * 比如，紧凑的间距(tight)让文字更紧密，宽松的间距(wide)让文字更通透。
 * 
 * 这个函数只有在用户设置了非默认值时才会生成自定义间距变量。
 * 
 * @param themeStyles 主题样式对象
 * @returns 字母间距CSS变量字符串，如果是默认值则返回空字符串
 */
const generateTrackingVariables = (themeStyles: ThemeStyles): string => {
  const styles = themeStyles["light"];
  if (styles["letter-spacing"] === "0em") {
    return "";
  }
  return `

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);`;
};

/**
 * 生成完整的主题变量集合
 * 
 * 这个函数整合了所有类型的CSS变量（颜色、字体、圆角、阴影等），
 * 并根据主题模式(light/dark)生成相应的CSS选择器和变量。
 * 
 * 它就像是把所有的设计元素组合在一起，形成完整的"装修方案"。
 * 
 * @param themeStyles 主题样式对象
 * @param mode 主题模式
 * @param formatColor 颜色格式化函数
 * @returns 完整的CSS变量集合字符串
 */
const generateThemeVariables = (
  themeStyles: ThemeStyles,
  mode: ThemeMode,
  formatColor: (color: string) => string
): string => {
  const selector = mode === "dark" ? ".dark" : ":root";
  const colorVars = generateColorVariables(themeStyles, mode, formatColor);
  const fontVars = generateFontVariables(themeStyles, mode);
  const radiusVar = `\n  --radius: ${themeStyles[mode].radius};`;
  const shadowVars = generateShadowVariables(
    getShadowMap({ styles: themeStyles, currentMode: mode })
  );
  const spacingVar =
    mode === "light" &&
    themeStyles["light"].spacing !== defaultLightThemeStyles.spacing
      ? `\n  --spacing: ${themeStyles["light"].spacing};`
      : "";

  const trackingVars =
    mode === "light" &&
    themeStyles["light"]["letter-spacing"] !==
      defaultLightThemeStyles["letter-spacing"]
      ? `\n  --tracking-normal: ${themeStyles["light"]["letter-spacing"]};`
      : "";

  return (
    selector +
    " {" +
    colorVars +
    fontVars +
    radiusVar +
    shadowVars +
    trackingVars +
    spacingVar +
    "\n}"
  );
};

/**
 * 生成Tailwind CSS v4内联主题
 * 
 * Tailwind CSS v4引入了新的@theme规则，允许直接在CSS中定义主题。
 * 这个函数生成适用于Tailwind CSSv4的内联主题格式。
 * 
 * 它主要是将前面定义的变量映射到Tailwind v4期望的格式，
 * 比如 `--background` 映射到 `--color-background`。
 * 
 * @param themeStyles 主题样式对象
 * @returns Tailwind v4主题内联代码
 */
const generateTailwindV4ThemeInline = (themeStyles: ThemeStyles): string => {
  return `@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);${generateTrackingVariables(themeStyles)}
}`;
};

/**
 * 生成完整的主题CSS代码
 * 
 * 这是整个文件的主要导出函数，它根据编辑器的状态生成完整的CSS主题代码。
 * 就像是一个总指挥，协调前面所有函数的工作，最终产出可用的主题CSS。
 * 
 * 它会：
 * 1. 验证输入的主题状态是否有效
 * 2. 生成明亮模式和暗黑模式的CSS变量
 * 3. 根据需要添加Tailwind v4兼容代码
 * 4. 添加全局字母间距设置（如果有自定义值）
 * 
 * @param themeEditorState 编辑器中的主题状态
 * @param colorFormat 颜色格式（默认HSL）
 * @param tailwindVersion Tailwind CSS版本（3或4）
 * @returns 完整的CSS主题代码字符串
 */
export const generateThemeCode = (
  themeEditorState: ThemeEditorState,
  colorFormat: ColorFormat = "hsl",
  tailwindVersion: "3" | "4" = "3"
): string => {
  if (
    !themeEditorState ||
    !("light" in themeEditorState.styles) ||
    !("dark" in themeEditorState.styles)
  ) {
    throw new Error("Invalid theme styles: missing light or dark mode");
  }

  const themeStyles = themeEditorState.styles as ThemeStyles;
  const formatColor = (color: string) =>
    colorFormatter(color, colorFormat, tailwindVersion);

  const lightTheme = generateThemeVariables(themeStyles, "light", formatColor);
  const darkTheme = generateThemeVariables(themeStyles, "dark", formatColor);
  const tailwindV4Theme =
    tailwindVersion === "4"
      ? `\n\n${generateTailwindV4ThemeInline(themeStyles)}`
      : "";

  const bodyLetterSpacing =
    themeStyles["light"]["letter-spacing"] !== "0em"
      ? "\n\nbody {\n  letter-spacing: var(--tracking-normal);\n}"
      : "";

  return `${lightTheme}\n\n${darkTheme}${tailwindV4Theme}${bodyLetterSpacing}`;
};
