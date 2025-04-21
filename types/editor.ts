// filepath: /Volumes/MI-1T/Developer/GitHub/note-tweakcn/types/editor.ts
/**
 * 编辑器类型定义文件
 * 
 * 这个文件定义了编辑器系统相关的所有TypeScript接口和类型。
 * 它为整个编辑器框架提供类型基础，支持主题编辑以及未来可能扩展的其他UI组件编辑功能。
 * 编辑器系统是应用的核心功能，这些类型定义决定了编辑器的结构和交互方式。
 */

import { ThemeStyles } from "./theme";

/**
 * 基础编辑器状态接口
 * 
 * 所有特定编辑器状态的基础接口，定义了编辑器状态必须包含的最小属性集。
 * 目前只要求包含主题样式，但未来可能扩展以支持更多通用属性。
 */
// Base interface for any editor's state
export interface BaseEditorState {
  styles: ThemeStyles;  // 编辑器使用的完整主题样式(亮色和暗色)
}

/**
 * 编辑器控制组件接口
 * 
 * 为不同类型的编辑器控制面板定义的通用接口。
 * 这是一个扩展点，允许为每种编辑器类型添加特定的控制选项。
 */
// Interface for editor-specific controls
export interface EditorControls {
  // Controls can be added per editor type as needed
  // 每种编辑器类型可以根据需要添加特定的控制选项
}

/**
 * 编辑器预览组件属性接口
 * 
 * 定义传递给预览组件的基本属性。
 * 预览组件负责展示当前编辑状态的视觉效果。
 */
// Interface for editor-specific preview props
export interface EditorPreviewProps {
  styles: ThemeStyles;  // 预览组件使用的完整主题样式
}

/**
 * 主题编辑器特定状态接口
 * 
 * 扩展基础编辑器状态，添加主题编辑器特有的属性。
 * 包括当前主题预设和选中的主题模式(亮色/暗色)。
 */
export interface ThemeEditorState extends BaseEditorState {
  preset?: string;               // 当前使用的主题预设名称(可选)
  styles: ThemeStyles;           // 当前编辑的完整主题样式
  currentMode: "light" | "dark"; // 当前选中的主题模式
}

/**
 * 编辑器类型
 * 
 * 定义系统支持的所有编辑器类型。
 * 当前支持的编辑器包括:
 * - button: 按钮编辑器
 * - input: 输入框编辑器
 * - card: 卡片组件编辑器
 * - dialog: 对话框编辑器
 * - theme: 全局主题编辑器
 * 
 * 这个类型可以随着应用功能的扩展而添加更多选项。
 */
// Type for available editors
export type EditorType = "button" | "input" | "card" | "dialog" | "theme";

/**
 * 编辑器配置接口
 * 
 * 定义编辑器实例的完整配置。
 * 每个编辑器都需要实现这个接口，提供:
 * - 基本信息(类型、名称、描述)
 * - 默认状态
 * - 控制面板组件
 * - 预览面板组件
 * 
 * 这是编辑器系统的核心接口，连接了编辑器类型、状态数据和UI组件。
 */
// Interface for editor configuration
export interface EditorConfig {
  type: EditorType;                    // 编辑器类型标识符
  name: string;                        // 编辑器显示名称
  description: string;                 // 编辑器功能描述
  defaultState: BaseEditorState;       // 编辑器默认初始状态
  controls: any;                       // 编辑器的控制面板组件，React组件类型
  preview: any;                        // 编辑器的预览面板组件，React组件类型
}
