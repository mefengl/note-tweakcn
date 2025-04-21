/**
 * 主编辑器组件文件
 * 
 * 这个文件实现了项目的核心编辑器界面，它将整个编辑器分为控制面板和预览面板两个主要部分。
 * 编辑器支持响应式设计，在桌面端展示为左右分栏布局，在移动端则转换为标签页形式。
 * 
 * 编辑器组件负责：
 * 1. 接收编辑器配置和初始状态
 * 2. 在桌面和移动设备上提供不同的布局
 * 3. 处理主题样式的变更并更新状态
 * 4. 连接控制面板和预览面板
 * 
 * 主要功能点：
 * - 使用ResizablePanelGroup实现可调整大小的面板
 * - 在移动设备上使用Tabs组件提供选项卡式体验
 * - 通过useEditorStore钩子管理主题状态
 */

"use client"; // 标记此组件为客户端组件，允许使用浏览器API和React钩子

import React from "react";
import {
  ResizablePanelGroup, // 可调整大小的面板组，用于管理多个可调整大小的面板
  ResizablePanel,      // 单个可调整大小的面板
  ResizableHandle,     // 面板之间的调整手柄
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 标签页组件，用于移动端布局
import {
  EditorConfig,       // 编辑器配置接口，定义了控制和预览组件
  BaseEditorState,    // 基础编辑器状态
  ThemeEditorState,   // 主题编辑器特定状态
} from "@/types/editor";
import { ThemeStyles } from "@/types/theme"; // 主题样式类型定义
import { Sliders } from "lucide-react"; // Lucide图标库中的滑块图标，用于移动端控制面板标签
import { useEditorStore } from "@/store/editor-store"; // 编辑器状态管理钩子

/**
 * 编辑器组件的属性接口
 * 
 * @property config - 编辑器配置，包含控制面板和预览面板的组件定义
 * @property initialState - 可选的初始编辑器状态，用于预设编辑器的起始状态
 */
interface EditorProps {
  config: EditorConfig;
  initialState?: BaseEditorState;
}

/**
 * 类型守卫函数：检查一个未知对象是否符合ThemeStyles类型
 * 
 * 这个函数用于运行时类型检查，确保传入的样式对象具有正确的结构。
 * ThemeStyles必须包含light和dark两个属性，分别对应亮色和暗色主题的样式。
 * 
 * @param styles - 需要检查的未知类型对象
 * @returns 如果对象符合ThemeStyles类型结构则返回true，否则返回false
 * 
 * 例如：
 * const validStyles = { light: {...}, dark: {...} }; // 有效样式对象
 * const invalidStyles = { light: {...} }; // 无效样式对象 (缺少dark属性)
 */
const isThemeStyles = (styles: unknown): styles is ThemeStyles => {
  return (
    !!styles &&
    typeof styles === "object" &&
    styles !== null &&
    "light" in styles &&
    "dark" in styles
  );
};

/**
 * 编辑器主组件
 * 
 * 这个函数组件是整个编辑器的核心部分，负责渲染编辑器界面并管理状态。
 * 它接收编辑器配置作为属性，并使用全局编辑器状态来渲染和更新UI。
 * 
 * @param {EditorProps} props - 编辑器组件属性
 * @returns 完整的编辑器UI组件
 */
const Editor: React.FC<EditorProps> = ({ config }) => {
  // 从编辑器状态存储中获取当前主题状态和状态更新函数
  const { themeState, setThemeState } = useEditorStore();
  
  // 从配置中提取控制面板和预览面板组件
  // 这是一种依赖注入模式，允许编辑器使用不同类型的控制面板和预览面板
  const Controls = config.controls;  // 控制面板组件
  const Preview = config.preview;    // 预览面板组件

  /**
   * 处理样式变化的回调函数
   * 
   * 当用户在控制面板中修改主题样式时，此函数会被调用。
   * 它将新的样式更新到编辑器状态中，从而触发相关组件的重新渲染。
   * 
   * @param {ThemeStyles} newStyles - 更新后的主题样式
   */
  const handleStyleChange = (newStyles: ThemeStyles) => {
    setThemeState({ ...themeState, styles: newStyles });
  };

  // 确保我们有有效的主题样式
  // 如果当前状态中的样式无效，就使用配置中的默认样式
  // 这种验证确保了即使状态损坏，编辑器也能正常工作
  const styles = !isThemeStyles(themeState.styles)
    ? (config.defaultState as ThemeEditorState).styles
    : themeState.styles;

  /**
   * 编辑器界面渲染
   * 
   * 编辑器提供两种布局：
   * 1. 桌面布局：使用ResizablePanelGroup实现左右可调整大小的面板
   * 2. 移动布局：使用Tabs组件实现选项卡式界面
   * 
   * 布局会根据媒体查询自动切换，提供最佳用户体验。
   */
  return (
    <div className="h-full overflow-hidden">
      {/* 桌面布局 - 仅在中等及以上屏幕尺寸显示 */}
      <div className="h-full hidden md:block">
        {/* 水平方向的可调整大小面板组 */}
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* 左侧控制面板 - 默认占30%宽度，可调整范围20%-40% */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <div className="h-full flex flex-col">
              {/* 渲染控制面板组件，传入当前样式、变更回调和当前模式 */}
              <Controls
                styles={styles}
                onChange={handleStyleChange}
                currentMode={themeState.currentMode}
              />
            </div>
          </ResizablePanel>
          
          {/* 面板之间的调整手柄 */}
          <ResizableHandle />
          
          {/* 右侧预览面板 - 默认占70%宽度，最小可调至20% */}
          <ResizablePanel defaultSize={70} minSize={20}>
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0 flex flex-col">
                {/* 渲染预览面板组件，传入当前样式和当前模式 */}
                <Preview styles={styles} currentMode={themeState.currentMode} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* 移动布局 - 仅在中等屏幕尺寸以下显示 */}
      <div className="h-full md:hidden">
        {/* 使用选项卡组件，默认显示控制面板 */}
        <Tabs defaultValue="controls" className="h-full">
          {/* 选项卡列表，占满宽度且无圆角 */}
          <TabsList className="w-full rounded-none">
            {/* 控制面板选项卡 */}
            <TabsTrigger value="controls" className="flex-1">
              {/* 滑块图标，形象地表示控制功能 */}
              <Sliders className="h-4 w-4 mr-2" />
              Controls
            </TabsTrigger>
            {/* 预览面板选项卡 */}
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
          </TabsList>
          
          {/* 控制面板内容 - 高度计算减去选项卡高度 */}
          <TabsContent value="controls" className="h-[calc(100%-2.5rem)] mt-0">
            <div className="h-full flex flex-col">
              {/* 渲染控制面板组件，与桌面版相同 */}
              <Controls
                styles={styles}
                onChange={handleStyleChange}
                currentMode={themeState.currentMode}
              />
            </div>
          </TabsContent>
          
          {/* 预览面板内容 - 高度计算减去选项卡高度 */}
          <TabsContent value="preview" className="h-[calc(100%-2.5rem)] mt-0">
            <div className="h-full flex flex-col">
              {/* 渲染预览面板组件，与桌面版相同 */}
              <Preview styles={styles} currentMode={themeState.currentMode} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Editor;
