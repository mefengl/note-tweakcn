/**
 * 主题类型定义文件
 * 
 * 这个文件定义了与主题系统相关的所有TypeScript接口和类型。
 * 它是整个主题系统的类型基础，确保主题相关数据在应用中的类型安全。
 * 这些类型定义被主题编辑器、预览组件和控制面板等多个组件共享使用。
 */

/**
 * 主题样式属性接口
 * 
 * 定义单个主题模式(亮色或暗色)的所有可定制属性。
 * 每个属性都是一个字符串，通常包含颜色值(HSL格式)、尺寸、字体等。
 * 这个接口非常关键，它定义了用户可以通过编辑器自定义的所有主题属性。
 */
export interface ThemeStyleProps {
  background: string;        // 全局背景色
  foreground: string;        // 全局前景色(主要文本颜色)
  card: string;              // 卡片组件背景色
  "card-foreground": string; // 卡片组件文本颜色
  popover: string;           // 弹出层背景色
  "popover-foreground": string; // 弹出层文本颜色
  primary: string;           // 主要按钮/强调元素背景色
  "primary-foreground": string; // 主要按钮/强调元素文本颜色
  secondary: string;         // 次要按钮/元素背景色
  "secondary-foreground": string; // 次要按钮/元素文本颜色
  muted: string;             // 弱化元素背景色
  "muted-foreground": string; // 弱化元素文本颜色
  accent: string;            // 强调元素背景色
  "accent-foreground": string; // 强调元素文本颜色
  destructive: string;       // 危险/删除操作背景色
  "destructive-foreground": string; // 危险/删除操作文本颜色
  border: string;            // 边框颜色
  input: string;             // 输入框边框颜色
  ring: string;              // 聚焦状态环状高亮颜色
  "chart-1": string;         // 图表颜色1
  "chart-2": string;         // 图表颜色2
  "chart-3": string;         // 图表颜色3
  "chart-4": string;         // 图表颜色4
  "chart-5": string;         // 图表颜色5
  sidebar: string;           // 侧边栏背景色
  "sidebar-foreground": string; // 侧边栏文本颜色
  "sidebar-primary": string; // 侧边栏主要按钮/元素背景色
  "sidebar-primary-foreground": string; // 侧边栏主要按钮/元素文本颜色
  "sidebar-accent": string;  // 侧边栏强调元素背景色
  "sidebar-accent-foreground": string; // 侧边栏强调元素文本颜色
  "sidebar-border": string;  // 侧边栏边框颜色
  "sidebar-ring": string;    // 侧边栏聚焦状态环状高亮颜色
  "font-sans": string;       // 无衬线字体堆栈
  "font-serif": string;      // 衬线字体堆栈
  "font-mono": string;       // 等宽字体堆栈
  radius: string;            // 通用边框圆角半径
  "shadow-color": string;    // 阴影颜色
  "shadow-opacity": string;  // 阴影不透明度
  "shadow-blur": string;     // 阴影模糊半径
  "shadow-spread": string;   // 阴影扩散半径
  "shadow-offset-x": string; // 阴影水平偏移
  "shadow-offset-y": string; // 阴影垂直偏移
  "letter-spacing": string;  // 字母间距
  spacing: string;           // 基础间距单位
}

/**
 * 完整主题样式接口
 * 
 * 包含亮色和暗色两种模式的完整主题样式。
 * 应用会根据用户选择或系统设置来切换显示亮色或暗色主题。
 */
export interface ThemeStyles {
  light: ThemeStyleProps;  // 亮色主题的完整样式属性
  dark: ThemeStyleProps;   // 暗色主题的完整样式属性
}

/**
 * 主题编辑器状态接口
 * 
 * 定义主题编辑器的完整状态，包括两种模式的样式和当前选择的模式。
 * 这个状态会被存储在编辑器组件的状态中，用于管理整个编辑过程。
 */
export interface ThemeEditorState {
  styles: ThemeStyles;               // 完整的主题样式(亮色和暗色)
  currentMode: "light" | "dark";     // 当前选择的主题模式
}

/**
 * 主题编辑器预览属性接口
 * 
 * 定义传递给预览组件的属性。
 * 预览组件会根据这些属性来展示当前编辑的主题效果。
 */
export interface ThemeEditorPreviewProps {
  styles: ThemeStyles;             // 完整的主题样式(亮色和暗色)
  currentMode: "light" | "dark";   // 当前选择的主题模式
}

/**
 * 主题编辑器控制面板属性接口
 * 
 * 定义传递给控制面板组件的属性。
 * 控制面板提供UI让用户编辑主题属性，并通过onChange回调通知变更。
 */
export interface ThemeEditorControlsProps {
  styles: ThemeStyles;                      // 完整的主题样式(亮色和暗色)
  currentMode: "light" | "dark";            // 当前选择的主题模式
  onChange: (styles: ThemeStyles) => void;  // 样式变更时的回调函数
}

/**
 * 主题预设类型
 * 
 * 定义主题预设的数据结构。预设是可以快速应用的主题配置，
 * 可以包含亮色和暗色模式下的部分或全部样式属性。
 * 
 * 预设可以有创建时间和显示名称，便于管理和展示。
 */
export type ThemePreset = {
  createdAt?: string;                        // 预设创建时间(可选)
  label?: string;                            // 预设显示名称(可选)
  styles: {
    light?: Partial<ThemeStyleProps>;        // 亮色模式下的样式(可选且可部分定义)
    dark?: Partial<ThemeStyleProps>;         // 暗色模式下的样式(可选且可部分定义)
  };
};
