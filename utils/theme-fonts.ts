/**
 * 主题字体配置
 * 
 * 这个文件管理着主题系统中所有可用的字体选项。
 * 字体分为三大类：
 * 1. Sans-serif（无衬线字体）：现代、清晰，适合界面文字
 * 2. Serif（衬线字体）：传统、优雅，适合长篇阅读
 * 3. Mono（等宽字体）：代码显示和技术内容
 */

import { ThemeEditorState, ThemeStyleProps } from "../types/theme";

/**
 * 无衬线字体列表
 * 这些字体特点是：
 * - 字形简洁，没有装饰性笔画
 * - 现代感强，适合数字界面
 * - 在小字号下保持清晰
 */
const sansSerifFontNames = [
  "Inter",          // 现代简约风格
  "Roboto",        // Google设计系统的默认字体
  "Open Sans",     // 优秀的可读性
  "Poppins",       // 几何风格
  "Montserrat",    // 优雅现代
  "Outfit",        // 圆润现代
  "Plus Jakarta Sans", // 专为屏幕优化
  "DM Sans",       // 简洁商务风格
  "Geist",         // Vercel设计的现代字体
  "Oxanium",       // 科技感强烈
];

/**
 * 衬线字体列表
 * 这些字体特点是：
 * - 字符末端有装饰性笔画
 * - 更正式、传统的外观
 * - 适合长篇文章阅读
 */
const serifFontNames = [
  "Merriweather",     // 经典优雅
  "Playfair Display", // 现代衬线设计
  "Lora",             // 平滑过渡的笔画
  "Source Serif Pro", // Adobe设计
  "Libre Baskerville", // 基于传统字体改良
  "Space Grotesk",    // 现代几何衬线
];

/**
 * 等宽字体列表
 * 这些字体特点是：
 * - 每个字符宽度相同
 * - 适合展示代码
 * - 便于对齐和格式化
 */
const monoFontNames = [
  "JetBrains Mono", // IDE优化的编程字体
  "Fira Code",      // Mozilla设计的编程字体
  "Source Code Pro", // Adobe的编程字体
  "IBM Plex Mono",  // IBM的现代等宽字体
  "Roboto Mono",    // Google的等宽字体
  "Space Mono",     // 未来科技风格
  "Geist Mono",     // Vercel的编程字体
];

/**
 * 字体映射表
 * 为每个字体名称提供完整的字体堆栈（font stack）
 * 包含后备字体，确保在主要字体无法加载时有合适的替代
 */
export const fonts: Record<string, string> = {
  // Sans-serif 字体堆栈
  Inter: "Inter, sans-serif",
  Roboto: "Roboto, sans-serif",
  "Open Sans": "Open Sans, sans-serif",
  Poppins: "Poppins, sans-serif",
  Montserrat: "Montserrat, sans-serif",
  Outfit: "Outfit, sans-serif",
  "Plus Jakarta Sans": "Plus Jakarta Sans, sans-serif",
  "DM Sans": "DM Sans, sans-serif",
  "IBM Plex Sans": "IBM Plex Sans, sans-serif",
  Geist: "Geist, sans-serif",
  Oxanium: "Oxanium, sans-serif",

  // Serif 字体堆栈
  Merriweather: "Merriweather, serif",
  "Playfair Display": "Playfair Display, serif",
  Lora: "Lora, serif",
  "Source Serif Pro": "Source Serif Pro, serif",
  "Libre Baskerville": "Libre Baskerville, serif",
  "Space Grotesk": "Space Grotesk, serif",

  // Monospace 字体堆栈
  "JetBrains Mono": "JetBrains Mono, monospace",
  "Fira Code": "Fira Code, monospace",
  "Source Code Pro": "Source Code Pro, monospace",
  "IBM Plex Mono": "IBM Plex Mono, monospace",
  "Roboto Mono": "Roboto Mono, monospace",
  "Space Mono": "Space Mono, monospace",
  "Geist Mono": "Geist Mono, monospace",
};

/**
 * 无衬线字体映射
 * 从字体映射表中筛选出无衬线字体
 */
export const sansSerifFonts = Object.fromEntries(
  Object.entries(fonts).filter(([key]) => sansSerifFontNames.includes(key))
);

/**
 * 衬线字体映射
 * 从字体映射表中筛选出衬线字体
 */
export const serifFonts = Object.fromEntries(
  Object.entries(fonts).filter(([key]) => serifFontNames.includes(key))
);

/**
 * 等宽字体映射
 * 从字体映射表中筛选出等宽字体
 */
export const monoFonts = Object.fromEntries(
  Object.entries(fonts).filter(([key]) => monoFontNames.includes(key))
);

/**
 * 获取应用的主题字体
 * 
 * 根据主题编辑器状态和字体键，返回对应的字体名称。
 * 如果找不到匹配的字体，返回 null。
 * 
 * @param state 主题编辑器状态
 * @param fontKey 字体键（"font-sans" | "font-serif" | "font-mono"）
 * @returns 字体名称或 null
 */
export const getAppliedThemeFont = (
  state: ThemeEditorState,
  fontKey: "font-sans" | "font-serif" | "font-mono"
): string | null => {
  const fontSans = state.styles.light[fontKey];
  // 根据值在字体映射表中查找键
  const key = Object.keys(fonts).find((key) => fonts[key].includes(fontSans));
  return key ? key : null;
};
