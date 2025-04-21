/**
 * 主题预览面板组件
 * 
 * 这个组件是主题编辑器的预览区域，它能够展示你正在创建的主题效果。
 * 想象一下，如果主题编辑器是一个画图软件，这个预览面板就是画布，
 * 能够实时显示你调整的颜色、字体和其他设置的效果。
 * 
 * 主要功能:
 * 1. 提供多个预设场景(卡片、邮件、任务等)来展示主题效果
 * 2. 显示主题的完整调色板
 * 3. 支持全屏预览和主题切换
 * 4. 响应式设计，适应不同尺寸的屏幕
 */

"use client"; // 表示这是一个客户端组件，将在浏览器中运行

// 导入必要的类型、组件和钩子函数
import { ThemeEditorPreviewProps } from "@/types/theme"; // 主题编辑器预览属性类型
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"; // 标签页组件，用于切换不同预览场景
import { ScrollArea, ScrollBar } from "../ui/scroll-area"; // 滚动区域组件，处理溢出内容
import ColorPreview from "./theme-preview/color-preview"; // 颜色预览组件，展示调色板
import TabsTriggerPill from "./theme-preview/tabs-trigger-pill"; // 胶囊型标签触发器组件
import ExamplesPreviewContainer from "./theme-preview/examples-preview-container"; // 示例预览容器
import { lazy } from "react"; // React的懒加载函数，用于提高性能
import { Button } from "@/components/ui/button"; // 按钮组件
import { Maximize, Minimize, Moon, Sun } from "lucide-react"; // 图标组件
import { useFullscreen } from "@/hooks/use-fullscreen"; // 全屏模式自定义钩子
import { cn } from "@/lib/utils"; // 用于条件合并className的工具函数
import { useTheme } from "@/components/theme-provider"; // 主题状态钩子
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // 工具提示组件，用于显示按钮说明
import { ActionBar } from "./action-bar"; // 操作栏组件

/**
 * 懒加载各种示例组件
 * 
 * 懒加载是一种性能优化技术，它只在需要时才加载组件代码，
 * 可以减少初始加载时间，让页面更快地显示出来。
 * 
 * 就像去超市购物，你不会一次把所有商品都买回家，
 * 而是在需要的时候才去购买特定的商品。
 */
const DemoCards = lazy(() => import("@/components/examples/demo-cards")); // 卡片示例组件
const DemoMail = lazy(() => import("@/components/examples/mail"));        // 邮件示例组件
const DemoTasks = lazy(() => import("@/components/examples/tasks"));      // 任务示例组件
const DemoMusic = lazy(() => import("@/components/examples/music"));      // 音乐示例组件
const DemoDashboard = lazy(() => import("@/components/examples/dashboard")); // 仪表盘示例组件

/**
 * 主题预览面板组件
 * 
 * 这个组件接收主题样式和当前模式(明亮或暗黑)作为属性，
 * 并提供一个交互式界面来预览这些样式在不同场景下的效果。
 * 
 * @param styles - 当前应用的主题样式对象，包含颜色、字体等设置
 * @param currentMode - 当前显示模式，"light"(明亮模式)或"dark"(暗黑模式)
 */
const ThemePreviewPanel = ({
  styles,
  currentMode,
}: ThemeEditorPreviewProps) => {
  // 使用全屏钩子来控制预览区域是否全屏显示
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  // 使用主题钩子来获取当前主题状态和切换主题的函数
  const { theme, toggleTheme } = useTheme();

  // 如果没有样式或当前模式的样式，不渲染任何内容
  if (!styles || !styles[currentMode]) {
    return null;
  }

  /**
   * 处理主题切换按钮点击的函数
   * 
   * 当用户点击切换主题按钮时，记录点击的位置坐标，
   * 以便可以从点击位置创建一个动画效果(水波纹效果)。
   * 
   * @param event - 鼠标点击事件对象
   */
  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event; // 获取点击位置的坐标
    toggleTheme({ x, y });                    // 切换主题并传递点击坐标
  };

  /**
   * 组件渲染部分
   * 
   * 这里返回的是整个预览面板的JSX结构，
   * 包括操作栏、标签页导航和各种预览内容。
   */
  return (
    <>
      {/* 操作栏 - 显示在预览面板顶部的工具栏 */}
      <ActionBar />
      
      {/* 
        主容器 - 根据是否全屏来应用不同的样式
        使用cn函数有条件地合并className，当isFullscreen为true时
        添加"fixed inset-0 z-50 bg-background"使其覆盖整个屏幕
      */}
      <div
        className={cn(
          "min-h-0 flex flex-col flex-1", // 基本样式
          isFullscreen && "fixed inset-0 z-50 bg-background" // 全屏模式时的额外样式
        )}
      >
        {/* 标签页组件 - 默认显示cards标签页 */}
        <Tabs defaultValue="cards" className="flex flex-col overflow-hidden">
          {/* 标签页头部 - 包含标签页切换按钮和全屏/主题切换按钮 */}
          <div className="flex items-center justify-between px-4 mt-2">
            {/* 标签页列表 - 圆形胶囊设计 */}
            <TabsList className="inline-flex w-fit items-center justify-center rounded-full bg-background px-0 text-muted-foreground">
              {/* 卡片示例标签页按钮 */}
              <TabsTriggerPill value="cards">Cards</TabsTriggerPill>
              
              {/* 
                在中等屏幕(md)及以上显示更多标签页按钮
                在小屏幕上自动隐藏以节省空间
              */}
              <div className="hidden md:flex">
                <TabsTriggerPill value="mail">Mail</TabsTriggerPill>
                <TabsTriggerPill value="tasks">Tasks</TabsTriggerPill>
                <TabsTriggerPill value="music">Music</TabsTriggerPill>
                <TabsTriggerPill value="dashboard">Dashboard</TabsTriggerPill>
              </div>
              
              {/* 颜色调色板标签页按钮 */}
              <TabsTriggerPill value="colors">Color Palette</TabsTriggerPill>
            </TabsList>

            {/* 右侧操作按钮区域 */}
            <div className="flex items-center gap-0">
              {/* 
                只在全屏模式下显示主题切换按钮 
                因为在正常模式下，主题控制面板已经提供了主题切换功能
              */}
              {isFullscreen && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"  // 透明背景按钮
                      size="icon"      // 图标大小
                      onClick={handleThemeToggle} // 点击切换主题
                      className="h-8 group"       // 高度和分组样式
                    >
                      {/* 根据当前主题显示不同图标 */}
                      {theme === "light" ? (
                        <Sun className="size-4 group-hover:scale-120 transition-all" /> // 太阳图标表示明亮模式
                      ) : (
                        <Moon className="size-4 group-hover:scale-120 transition-all" /> // 月亮图标表示暗黑模式
                      )}
                    </Button>
                  </TooltipTrigger>
                  {/* 按钮提示文本 */}
                  <TooltipContent>Toggle Theme</TooltipContent>
                </Tooltip>
              )}
              
              {/* 全屏切换按钮，总是显示 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"  // 透明背景按钮
                    size="icon"      // 图标大小
                    onClick={toggleFullscreen} // 点击切换全屏状态
                    className="h-8 group"       // 高度和分组样式
                  >
                    {/* 根据当前全屏状态显示不同图标 */}
                    {isFullscreen ? (
                      <Minimize className="size-4 group-hover:scale-120 transition-all" /> // 缩小图标表示退出全屏
                    ) : (
                      <Maximize className="size-4 group-hover:scale-120 transition-all" /> // 放大图标表示进入全屏
                    )}
                  </Button>
                </TooltipTrigger>
                {/* 按钮提示文本，根据当前全屏状态显示不同提示 */}
                <TooltipContent>
                  {isFullscreen ? "Exit full screen" : "Full screen"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* 
            滚动区域 - 用于处理内容溢出情况
            让用户可以滚动查看超出可视区域的内容
          */}
          <ScrollArea className="rounded-lg flex flex-col flex-1 border m-4 mt-2 overflow-hidden">
            <div className="flex flex-col flex-1 h-full">
              {/* 卡片示例标签页内容 */}
              <TabsContent value="cards" className="space-y-6 my-4 px-4 h-full">
                <ExamplesPreviewContainer>
                  {/* 卡片示例组件 - 展示不同类型的卡片UI */}
                  <DemoCards />
                </ExamplesPreviewContainer>
              </TabsContent>

              {/* 
                邮件应用标签页内容
                @container 是一个CSS容器查询类，允许基于父容器大小而非视口大小来应用样式
              */}
              <TabsContent
                value="mail"
                className="space-y-6 mt-0 h-full @container"
              >
                {/* 
                  设置最小宽度为1300px，确保邮件应用有足够的空间展示
                  即使容器较小，也会保持这个最小宽度，用户可以水平滚动查看
                */}
                <ExamplesPreviewContainer className="min-w-[1300px]">
                  {/* 邮件应用示例 - 展示邮件界面的UI */}
                  <DemoMail />
                </ExamplesPreviewContainer>
              </TabsContent>

              {/* 任务管理标签页内容 */}
              <TabsContent
                value="tasks"
                className="space-y-6 mt-0 h-full @container"
              >
                <ExamplesPreviewContainer className="min-w-[1300px] ">
                  {/* 任务管理示例 - 展示待办事项和任务列表UI */}
                  <DemoTasks />
                </ExamplesPreviewContainer>
              </TabsContent>

              {/* 音乐应用标签页内容 */}
              <TabsContent
                value="music"
                className="space-y-6 mt-0 h-full @container"
              >
                <ExamplesPreviewContainer className="min-w-[1300px]">
                  {/* 音乐应用示例 - 展示音乐播放器和专辑列表UI */}
                  <DemoMusic />
                </ExamplesPreviewContainer>
              </TabsContent>

              {/* 仪表盘标签页内容 */}
              <TabsContent
                value="dashboard"
                className="space-y-6 mt-0 h-full @container relative"
              >
                {/* 
                  仪表盘需要更大的宽度(1400px)来正确显示图表和数据
                  因为仪表盘通常包含多个并排的数据可视化元素
                */}
                <ExamplesPreviewContainer className="min-w-[1400px]">
                  {/* 仪表盘示例 - 展示数据图表和分析界面 */}
                  <DemoDashboard />
                </ExamplesPreviewContainer>
              </TabsContent>

              {/* 颜色调色板标签页内容 */}
              <TabsContent value="colors" className="p-4 space-y-6">
                {/* 
                  颜色预览组件 - 展示当前主题的所有颜色
                  传入当前的样式和模式，让用户可以看到所有定义的颜色
                */}
                <ColorPreview styles={styles} currentMode={currentMode} />
              </TabsContent>

              {/* 水平滚动条 - 用于水平滚动查看宽度较大的内容 */}
              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </>
  );
};

/**
 * 导出主题预览面板组件
 * 
 * 这个组件是主题编辑器的核心部分之一，它使用户能够:
 * 1. 在不同的UI场景中预览他们的主题设置
 * 2. 在明亮和暗黑模式之间切换来查看效果
 * 3. 使用全屏模式获得更沉浸式的预览体验
 * 
 * 它像是一面"魔镜"，能够立即反映出用户在控制面板中所做的每一个调整，
 * 帮助用户直观地了解他们的设计决策会如何影响最终的用户界面。
 */

export default ThemePreviewPanel;
