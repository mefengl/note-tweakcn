/**
 * 主题配置文件 - 基础主题设置
 * 
 * 这个文件是整个主题系统的基础，定义了应用的默认主题风格。
 * 它包含了亮色和暗色主题的默认样式值，以及两种模式共享的通用样式属性。
 * 所有颜色都使用 HSL 格式，便于调整明度和饱和度。
 */

import { ThemeEditorState } from "../types/theme";

/**
 * 亮色和暗色主题共享的样式属性列表
 * 这些属性在亮色和暗色主题中使用相同的值，不需要单独设置
 * 当用户在编辑器中修改亮色主题的这些属性时，暗色主题会自动应用相同的值
 */
// these are common between light and dark modes
// we can assume that light mode's value will be used for dark mode as well
export const COMMON_STYLES = [
  "font-sans",    // 无衬线字体，用于大部分UI文本
  "font-serif",   // 衬线字体，用于特定场景如标题等
  "font-mono",    // 等宽字体，用于代码展示
  "radius",       // 边框圆角半径
  "shadow-opacity", // 阴影不透明度
  "shadow-blur",  // 阴影模糊半径
  "shadow-spread", // 阴影扩散半径
  "shadow-offset-x", // 阴影X轴偏移量
  "shadow-offset-y", // 阴影Y轴偏移量
  "letter-spacing", // 字母间距
  "spacing",      // 基础间距单位
];

/**
 * 默认的无衬线字体堆栈
 * 按照优先级从高到低排列，确保在各种操作系统上都有良好表现
 * 包括系统字体和通用后备字体，以及emoji字体支持
 */
export const DEFAULT_FONT_SANS =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

/**
 * 默认的衬线字体堆栈
 * 适合用于正文内容、文章标题等需要更正式外观的场景
 */
export const DEFAULT_FONT_SERIF =
  'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

/**
 * 默认的等宽字体堆栈
 * 主要用于展示代码、终端输出等需要字符等宽的内容
 */
export const DEFAULT_FONT_MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/**
 * 默认亮色主题样式
 * 
 * 这个对象定义了应用亮色模式下的所有颜色和风格变量
 * 这些值将被用于生成CSS变量，并应用到整个应用界面
 * 主要包括:
 * - 背景和前景色
 * - 卡片组件颜色
 * - 弹出层颜色
 * - 主要和次要按钮颜色
 * - 弱化文本颜色
 * - 强调色和破坏性操作色
 * - 边框和输入框颜色
 * - 图表颜色系列
 * - 侧边栏专用颜色
 * - 字体和间距设置
 * - 阴影相关设置
 */
// Default light theme styles
export const defaultLightThemeStyles = {
  background: "hsl(0 0% 100%)",        // 页面背景色: 纯白色
  foreground: "hsl(0 0% 14.5%)",       // 前景色(主文本色): 深灰色接近黑色
  card: "hsl(0 0% 100%)",              // 卡片背景色: 纯白色
  "card-foreground": "hsl(0 0% 14.5%)", // 卡片文本色: 深灰色接近黑色
  popover: "hsl(0 0% 100%)",           // 弹出层背景色: 纯白色
  "popover-foreground": "hsl(0 0% 14.5%)", // 弹出层文本色: 深灰色接近黑色
  primary: "hsl(0 0% 20.5%)",          // 主要按钮背景色: 深灰色
  "primary-foreground": "hsl(0 0% 98.5%)", // 主要按钮文本色: 几乎纯白
  secondary: "hsl(0 0% 97%)",          // 次要按钮背景色: 非常浅的灰色
  "secondary-foreground": "hsl(0 0% 20.5%)", // 次要按钮文本色: 深灰色
  muted: "hsl(0 0% 97%)",              // 弱化元素背景色: 非常浅的灰色
  "muted-foreground": "hsl(0 0% 55.6%)", // 弱化元素文本色: 中灰色
  accent: "hsl(0 0% 97%)",             // 强调元素背景色: 非常浅的灰色
  "accent-foreground": "hsl(0 0% 20.5%)", // 强调元素文本色: 深灰色
  destructive: "hsl(0 80% 57.7%)",     // 破坏性操作背景色: 鲜红色
  "destructive-foreground": "hsl(0 0% 100%)", // 破坏性操作文本色: 纯白色
  border: "hsl(0 0% 92.2%)",           // 边框颜色: 浅灰色
  input: "hsl(0 0% 92.2%)",            // 输入框边框颜色: 浅灰色
  ring: "hsl(0 0% 70.8%)",             // 焦点环颜色: 中灰色
  "chart-1": "hsl(41 78% 64.6%)",      // 图表颜色1: 橙黄色
  "chart-2": "hsl(185 68% 60%)",       // 图表颜色2: 青色
  "chart-3": "hsl(227 65% 39.8%)",     // 图表颜色3: 深蓝色
  "chart-4": "hsl(84 63% 82.8%)",      // 图表颜色4: 浅绿色
  "chart-5": "hsl(70 68% 76.9%)",      // 图表颜色5: 黄绿色
  radius: "0.625rem",                  // 通用圆角半径: 10px
  sidebar: "hsl(0 0% 98.5%)",          // 侧边栏背景色: 几乎纯白
  "sidebar-foreground": "hsl(0 0% 14.5%)", // 侧边栏文本色: 深灰色接近黑色
  "sidebar-primary": "hsl(0 0% 20.5%)", // 侧边栏主要按钮色: 深灰色
  "sidebar-primary-foreground": "hsl(0 0% 98.5%)", // 侧边栏主要按钮文本色: 几乎纯白
  "sidebar-accent": "hsl(0 0% 97%)",   // 侧边栏强调色: 非常浅的灰色
  "sidebar-accent-foreground": "hsl(0 0% 20.5%)", // 侧边栏强调文本色: 深灰色
  "sidebar-border": "hsl(0 0% 92.2%)", // 侧边栏边框色: 浅灰色
  "sidebar-ring": "hsl(0 0% 70.8%)",   // 侧边栏焦点环色: 中灰色
  "font-sans": DEFAULT_FONT_SANS,      // 无衬线字体堆栈
  "font-serif": DEFAULT_FONT_SERIF,    // 衬线字体堆栈
  "font-mono": DEFAULT_FONT_MONO,      // 等宽字体堆栈

  "shadow-color": "hsl(0 0% 0%)",      // 阴影颜色: 纯黑色
  "shadow-opacity": "0.1",             // 阴影不透明度: 10%
  "shadow-blur": "3px",                // 阴影模糊半径: 3px
  "shadow-spread": "0px",              // 阴影扩散半径: 0px
  "shadow-offset-x": "0",              // 阴影水平偏移: 0px
  "shadow-offset-y": "1px",            // 阴影垂直偏移: 1px向下

  "letter-spacing": "0em",             // 字母间距: 正常
  spacing: "0.25rem",                  // 基础间距单位: 4px
};

/**
 * 默认暗色主题样式
 * 
 * 从亮色主题继承基础样式，然后覆盖部分颜色变量以适应暗色模式
 * 暗色模式中保持了相同的字体、圆角和间距设置
 * 但颜色反转以提供更好的夜间观看体验
 */
// Default dark theme styles
export const defaultDarkThemeStyles = {
  ...defaultLightThemeStyles,  // 继承亮色主题的所有样式属性
  background: "hsl(240 10% 3.9%)",    // 页面背景色: 几乎纯黑的深蓝灰色
  foreground: "hsl(0 0% 98%)",        // 前景色(主文本色): 几乎纯白
  card: "hsl(240 10% 3.9%)",          // 卡片背景色: 几乎纯黑的深蓝灰色
  "card-foreground": "hsl(0 0% 98%)", // 卡片文本色: 几乎纯白
  popover: "hsl(240 10% 3.9%)",       // 弹出层背景色: 几乎纯黑的深蓝灰色
  "popover-foreground": "hsl(0 0% 98%)", // 弹出层文本色: 几乎纯白
  primary: "hsl(0 0% 98%)",           // 主要按钮背景色: 几乎纯白
  "primary-foreground": "hsl(240 5.9% 10%)", // 主要按钮文本色: 深灰色接近黑色
  secondary: "hsl(240 3.7% 15.9%)",   // 次要按钮背景色: 深灰色
  "secondary-foreground": "hsl(0 0% 98%)", // 次要按钮文本色: 几乎纯白
  muted: "hsl(240 3.7% 15.9%)",       // 弱化元素背景色: 深灰色
  "muted-foreground": "hsl(240 5% 64.9%)", // 弱化元素文本色: 中灰色
  accent: "hsl(240 3.7% 15.9%)",      // 强调元素背景色: 深灰色
  "accent-foreground": "hsl(0 0% 98%)", // 强调元素文本色: 几乎纯白
  destructive: "hsl(0 62.8% 30.6%)",  // 破坏性操作背景色: 暗红色
  "destructive-foreground": "hsl(0 85.7% 97.3%)", // 破坏性操作文本色: 几乎纯白带粉色调
  border: "hsl(240 3.7% 15.9%)",      // 边框颜色: 深灰色
  input: "hsl(240 3.7% 15.9%)",       // 输入框边框颜色: 深灰色
  ring: "hsl(240 4.9% 83.9%)",        // 焦点环颜色: 浅灰色
  "chart-1": "hsl(220 70% 50%)",      // 图表颜色1: 鲜亮的蓝色
  "chart-2": "hsl(160 60% 45%)",      // 图表颜色2: 适中的绿色
  "chart-3": "hsl(30 80% 55%)",       // 图表颜色3: 橙色
  "chart-4": "hsl(280 65% 60%)",      // 图表颜色4: 紫色
  "chart-5": "hsl(340 75% 55%)",      // 图表颜色5: 粉红色
  // Actual has radius but not in Expected, keeping it as is
  radius: "0.625rem",                  // 通用圆角半径: 保持与亮色模式一致
  // Converting sidebar-related variables to match Actual format
  sidebar: "hsl(240 5.9% 10%)",        // 侧边栏背景色: 深灰色接近黑色
  "sidebar-foreground": "hsl(240 4.8% 95.9%)", // 侧边栏文本色: 几乎纯白
  "sidebar-primary": "hsl(224.3 76.3% 48%)", // 侧边栏主要按钮色: 亮蓝色
  "sidebar-primary-foreground": "hsl(0 0% 100%)", // 侧边栏主要按钮文本色: 纯白
  "sidebar-accent": "hsl(240 3.7% 15.9%)", // 侧边栏强调色: 深灰色
  "sidebar-accent-foreground": "hsl(240 4.8% 95.9%)", // 侧边栏强调文本色: 几乎纯白
  "sidebar-border": "hsl(240 3.7% 15.9%)", // 侧边栏边框色: 深灰色
  "sidebar-ring": "hsl(240 4.9% 83.9%)", // 侧边栏焦点环色: 浅灰色

  "shadow-color": "hsl(0 0% 0%)",      // 阴影颜色: 纯黑色（保持与亮色模式一致）

  "letter-spacing": "0em",             // 字母间距: 正常（保持与亮色模式一致）
  spacing: "0.25rem",                  // 基础间距单位: 4px（保持与亮色模式一致）
};

/**
 * 默认主题状态
 * 
 * 这个对象是编辑器状态的初始值，包含了亮色和暗色主题的样式设置
 * 同时根据用户系统偏好自动选择默认的主题模式(亮色或暗色)
 * 
 * 注意: 
 * - 只在浏览器环境中检测系统主题偏好
 * - 在服务器端渲染时默认为亮色模式
 */
// Default theme state
export const defaultThemeState: ThemeEditorState = {
  styles: {
    light: defaultLightThemeStyles,  // 亮色主题样式配置
    dark: defaultDarkThemeStyles,    // 暗色主题样式配置
  },
  currentMode:
    // 检查是否在浏览器环境且用户系统偏好为暗色模式
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"  // 如果是，则使用暗色模式
      : "light", // 否则使用亮色模式
};
