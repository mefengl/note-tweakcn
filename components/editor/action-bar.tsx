/**
 * ActionBar 组件
 * 
 * 这个组件实现了主题编辑器顶部的操作工具栏，提供了以下功能：
 * 1. 切换亮色/暗色模式
 * 2. 检查颜色对比度
 * 3. 导入自定义CSS变量
 * 4. 重置主题到预设默认值
 * 5. 查看生成的主题代码
 * 
 * 操作栏采用了简洁的设计风格，在移动端隐藏部分按钮文字标签，只显示图标，
 * 同时通过Tooltip提供操作提示，提高用户体验。
 */

"use client"; // 指示这是客户端组件，可以使用React hooks和浏览器API

// 导入必要的依赖
import { useEditorStore } from "@/store/editor-store"; // 引入主题编辑器状态管理
import { Button } from "../ui/button"; // 引入按钮UI组件
import { FileCode, RefreshCw, Code, Moon, Sun } from "lucide-react"; // 引入图标
import CssImportDialog from "./css-import-dialog"; // 引入CSS导入对话框组件
import { useState } from "react"; // 引入React状态钩子
import { parseCssInput } from "@/utils/parse-css-input"; // 引入CSS解析工具
import { toast } from "../ui/use-toast"; // 引入提示通知组件
import { CodePanelDialog } from "./code-panel-dialog"; // 引入代码面板对话框组件
import { Separator } from "../ui/separator"; // 引入分隔符组件
import * as SwitchPrimitives from "@radix-ui/react-switch"; // 引入开关组件
import { useTheme } from "../theme-provider"; // 引入主题上下文
import ContrastChecker from "./contrast-checker"; // 引入对比度检查组件
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"; // 引入提示工具组件

/**
 * ActionBar组件 - 主题编辑器的顶部操作栏
 * 
 * 提供各种功能按钮，如切换主题模式、导入CSS、重置和查看生成的代码
 */
export function ActionBar() {
  // 从编辑器状态管理中获取需要的状态和方法
  const {
    themeState,          // 当前主题状态
    resetToCurrentPreset,    // 重置为当前预设的方法
    setThemeState,           // 更新主题状态的方法
    hasCurrentPresetChanged, // 检查当前预设是否被修改过的方法
  } = useEditorStore();
  
  // 控制CSS导入对话框的显示状态
  const [cssImportOpen, setCssImportOpen] = useState(false);
  // 控制代码面板对话框的显示状态
  const [codePanelOpen, setCodePanelOpen] = useState(false);

  /**
   * 处理CSS导入的函数
   * 
   * @param css - 用户输入的CSS字符串
   * 
   * 这个函数会解析用户输入的CSS，提取出亮色和暗色模式的颜色变量，
   * 然后合并到当前主题中，并显示成功提示
   */
  const handleCssImport = (css: string) => {
    // 解析CSS输入，提取亮色和暗色模式的颜色变量
    const { lightColors, darkColors } = parseCssInput(css);
    
    // 合并解析出的颜色变量到当前主题样式中
    const styles = {
      ...themeState.styles,
      light: { ...themeState.styles.light, ...lightColors }, // 合并亮色模式颜色
      dark: { ...themeState.styles.dark, ...darkColors },    // 合并暗色模式颜色
    };

    // 更新主题状态
    setThemeState({
      ...themeState,
      styles,
    });

    // 显示导入成功的提示消息
    toast({
      title: "CSS imported",
      description: "Your custom CSS has been imported successfully",
    });
  };

  // 获取当前全局主题状态和切换主题的方法
  const { theme, toggleTheme } = useTheme();

  /**
   * 处理主题切换的函数
   * 
   * @param event - 鼠标点击事件
   * 
   * 这个函数从点击事件中获取鼠标坐标，
   * 然后调用toggleTheme方法切换主题，
   * 坐标信息可能用于切换时的动画效果
   */
  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;  // 获取点击时的鼠标坐标
    toggleTheme({ x, y });  // 调用切换主题的方法，并传入坐标信息
  };

  // 组件渲染
  return (
    <div className="border-b">
      {/* 操作栏容器 */}
      <div className="flex h-14 items-center justify-end gap-4 px-4">
        <div className="flex items-center gap-2">
          {/* 亮色/暗色模式切换开关 */}
          <div className="px-2">
            <Tooltip>
              <TooltipTrigger>
                {/* 使用Radix UI的Switch组件实现主题切换开关 */}
                <SwitchPrimitives.Root
                  checked={theme === "dark"} // 根据当前主题设置开关状态
                  onClick={handleThemeToggle} // 点击时触发主题切换
                  className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent data-[state=unchecked]:bg-input"
                >
                  {/* 开关滑块 */}
                  <SwitchPrimitives.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 flex items-center justify-center">
                    {/* 根据当前主题显示不同图标 */}
                    {theme === "dark" ? (
                      <Moon className="size-3" /> // 暗色模式显示月亮图标
                    ) : (
                      <Sun className="size-3" />  // 亮色模式显示太阳图标
                    )}
                  </SwitchPrimitives.Thumb>
                </SwitchPrimitives.Root>
              </TooltipTrigger>
              <TooltipContent>Toggle light/dark mode</TooltipContent>
            </Tooltip>
          </div>
          
          {/* 垂直分隔线 */}
          <Separator orientation="vertical" className="h-8" />
          
          {/* 颜色对比度检查工具 - 帮助用户确保颜色搭配符合可访问性标准 */}
          <ContrastChecker
            currentStyles={themeState.styles[themeState.currentMode]} // 传递当前模式的样式到对比度检查组件
          />
          
          {/* CSS导入按钮 */}
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                onClick={() => setCssImportOpen(true)} // 点击打开CSS导入对话框
              >
                <FileCode className="size-3.5" /> {/* 文件代码图标 */}
                {/* 在移动设备上隐藏文本标签，只显示图标 */}
                <span className="text-sm hidden md:block">Import</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import CSS variables</TooltipContent>
          </Tooltip>
          
          {/* 重置按钮 - 将主题重置到当前预设的默认值 */}
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                onClick={resetToCurrentPreset} // 点击重置当前预设
                disabled={!hasCurrentPresetChanged()} // 只有当预设被修改过时才启用
              >
                <RefreshCw className="size-3.5" /> {/* 刷新图标 */}
                {/* 在移动设备上隐藏文本标签，只显示图标 */}
                <span className="text-sm hidden md:block">Reset</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset to preset defaults</TooltipContent>
          </Tooltip>

          {/* 垂直分隔线 */}
          <Separator orientation="vertical" className="h-8" />
          
          {/* 查看代码按钮 - 打开代码面板显示生成的主题代码 */}
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="secondary" // 使用次要样式以区别于其他按钮
                size="sm"
                className="h-8 px-2 gap-1.5"
                onClick={() => setCodePanelOpen(true)} // 点击打开代码面板对话框
              >
                <Code className="size-3.5" /> {/* 代码图标 */}
                <span className="text-sm">Code</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>View theme code</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* CSS导入对话框组件 - 默认隐藏，点击导入按钮时显示 */}
      <CssImportDialog
        open={cssImportOpen} // 控制对话框是否打开
        onOpenChange={setCssImportOpen} // 处理对话框打开状态变化
        onImport={handleCssImport} // 处理导入操作的回调函数
      />
      
      {/* 代码面板对话框组件 - 默认隐藏，点击代码按钮时显示 */}
      <CodePanelDialog
        open={codePanelOpen} // 控制对话框是否打开
        onOpenChange={setCodePanelOpen} // 处理对话框打开状态变化
        themeEditorState={themeState} // 传递当前主题状态以生成代码
      />
    </div>
  );
}
