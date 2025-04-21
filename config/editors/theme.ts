/**
 * 主题编辑器配置文件
 * 
 * 这个文件定义了主题编辑器的配置信息，是主题编辑功能的核心配置文件。
 * 它告诉应用如何构建和呈现主题编辑器界面，包括控制面板、预览面板、
 * 默认状态等关键信息。
 */

import { EditorConfig } from "@/types/editor";
import ThemeControlPanel from "@/components/editor/theme-control-panel";
import ThemePreviewPanel from "@/components/editor/theme-preview-panel";
import { generateThemeCode } from "@/utils/theme-style-generator";
import { defaultThemeState } from "@/config/theme";

/**
 * 主题编辑器配置对象
 * 
 * 这个对象实现了EditorConfig接口，定义了主题编辑器的完整配置：
 * - type: 编辑器类型标识，用于在多编辑器系统中区分
 * - name: 编辑器显示名称，用于UI展示
 * - description: 编辑器功能简述，向用户解释此编辑器的用途
 * - defaultState: 编辑器的初始状态，使用从theme.ts导入的默认主题状态
 * - controls: 控制面板组件，用于展示所有可编辑的主题属性
 * - preview: 预览面板组件，用于实时展示主题修改的效果
 * 
 * 这个配置对象会被上层组件读取，从而构建完整的主题编辑界面
 */
export const themeEditorConfig: EditorConfig = {
  type: "theme",           // 编辑器类型："theme"表示这是一个主题编辑器
  name: "Theme",           // 编辑器名称：在UI中显示为"Theme"
  description: "Customize your global theme colors",  // 简短描述：告诉用户可以自定义全局主题颜色
  defaultState: defaultThemeState,  // 默认状态：使用config/theme.ts中定义的默认主题状态
  controls: ThemeControlPanel,      // 控制面板组件：用于编辑主题属性的UI组件
  preview: ThemePreviewPanel,       // 预览面板组件：用于预览主题效果的UI组件
};
