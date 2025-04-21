/**
 * 主题控制面板组件
 * 
 * 这是一个复杂的控制面板，用来让用户自定义网站的外观主题。
 * 想象一下，如果你在画画，这个面板就像是你的调色盘和工具箱，
 * 可以帮助你选择颜色、字体、阴影等各种元素来装饰你的网站。
 * 
 * 主要功能：
 * 1. 提供颜色选择器，让用户可以修改网站上各个元素的颜色
 * 2. 允许用户选择不同的字体样式
 * 3. 调整元素的圆角大小、间距和阴影效果
 * 4. 支持预设主题的快速应用
 * 5. 分类展示不同类型的设置（颜色、排版、其他）
 */

"use client"; // 标记此组件为客户端组件，会在浏览器中运行，而不是服务器

import React from "react";
import { ThemeEditorControlsProps, ThemeStyleProps } from "@/types/theme";
import ControlSection from "./control-section";
import ColorPicker from "./color-picker";
import { ScrollArea } from "../ui/scroll-area";
import ThemePresetSelect from "./theme-preset-select";
import { presets } from "../../utils/theme-presets";
import {
  getAppliedThemeFont,
  monoFonts,
  sansSerifFonts,
  serifFonts,
} from "../../utils/theme-fonts";
import { useEditorStore } from "../../store/editor-store";
import { Label } from "../ui/label";
import { SliderWithInput } from "./slider-with-input";
import { Tabs, TabsList, TabsContent } from "../ui/tabs";
import ThemeFontSelect from "./theme-font-select";
import {
  COMMON_STYLES,
  DEFAULT_FONT_MONO,
  DEFAULT_FONT_SANS,
  DEFAULT_FONT_SERIF,
  defaultThemeState,
} from "../../config/theme";
import { Separator } from "../ui/separator";
import { AlertCircle } from "lucide-react";
import ShadowControl from "./shadow-control";
import TabsTriggerPill from "./theme-preview/tabs-trigger-pill";

/**
 * 主题控制面板组件定义
 * 
 * @param styles - 当前应用的主题样式
 * @param currentMode - 当前使用的模式（明亮模式或暗黑模式）
 * @param onChange - 当样式改变时的回调函数
 */
const ThemeControlPanel = ({
  styles,
  currentMode,
  onChange,
}: ThemeEditorControlsProps) => {
  // 从编辑器状态管理中获取应用主题预设的函数和当前主题状态
  const { applyThemePreset, themeState } = useEditorStore();

  /**
   * 计算当前样式
   * 
   * 这里使用了React.useMemo来优化性能，只有当currentMode或styles变化时才重新计算
   * 它将默认主题样式与用户自定义样式合并，确保所有必要的样式属性都存在
   * 
   * 就像做蛋糕，我们有基本配方（默认样式），然后加入特殊配料（用户的自定义样式）
   */
  const currentStyles = React.useMemo(
    () => ({
      ...defaultThemeState.styles[currentMode],
      ...styles?.[currentMode],
    }),
    [currentMode, styles]
  );

  /**
   * 更新特定样式属性的函数
   * 
   * 这个函数会在用户调整任何一个样式控件（如颜色选择器、滑块等）时被调用
   * 
   * @param key - 要更新的样式属性名称
   * @param value - 新的样式值
   * 
   * 举例：如果用户修改了"primary"颜色，key会是"primary"，value会是新选择的颜色代码
   */
  const updateStyle = React.useCallback(
    <K extends keyof typeof currentStyles>(
      key: K,
      value: (typeof currentStyles)[K]
    ) => {
      // 对于通用样式（如字体、圆角等），同时更新明亮和暗黑两种模式
      if (COMMON_STYLES.includes(key)) {
        onChange({
          ...styles,
          light: { ...styles.light, [key]: value },
          dark: { ...styles.dark, [key]: value },
        });
        return;
      }

      // 只更新当前模式的样式
      onChange({
        ...styles,
        [currentMode]: {
          ...currentStyles,
          [key]: value,
        },
      });
    },
    [onChange, styles, currentMode, currentStyles]
  );

  // 确保我们有有效的样式数据，如果没有就不显示任何内容
  if (!currentStyles) {
    return null; // 或者一些后备UI
  }

  // 从样式中提取圆角值，去掉"rem"单位转为数字，方便滑块使用
  const radius = parseFloat(currentStyles.radius.replace("rem", ""));

  /**
   * 主题控制面板的界面结构
   * 
   * 整体分为三部分：
   * 1. 顶部的主题预设选择器 
   * 2. 中间的标签导航（颜色、排版、其他）
   * 3. 下方的具体控制区域，根据选中的标签显示不同内容
   */
  return (
    <>
      {/* 顶部的主题预设选择区 */}
      <div className="border-b">
        <ThemePresetSelect
          presets={presets}
          currentPreset={themeState.preset || null}
          onPresetChange={applyThemePreset}
        />
      </div>
      <div className="space-y-4 min-h-0 flex-1 flex flex-col">
        <Tabs
          defaultValue="colors" // 默认显示颜色标签页
          className="w-full flex-1 flex flex-col min-h-0"
        >
          {/* 标签导航栏 */}
          <div className="px-4 mt-2">
            <TabsList className="inline-flex w-fit items-center justify-center rounded-full bg-background px-0 text-muted-foreground">
              <TabsTriggerPill value="colors">Colors</TabsTriggerPill>
              <TabsTriggerPill value="typography">Typography</TabsTriggerPill>
              <TabsTriggerPill value="other">Other</TabsTriggerPill>
            </TabsList>
          </div>

          {/* 带滚动功能的内容区域 */}
          <ScrollArea className="h-full pb-40 p-4 pt-0 flex-1">
            {/* 颜色设置标签页 */}
            <TabsContent value="colors">
              {/* 主颜色设置区块 */}
              <ControlSection
                title="Primary Colors"
                id="primary-colors"
                expanded
              >
                {/* 主色调选择器 - 这是网站中最常用、最突出的颜色 */}
                <ColorPicker
                  color={currentStyles.primary}
                  onChange={(color) => updateStyle("primary", color)}
                  label="Primary"
                />
                {/* 主色调上的文字颜色 - 确保在主色调背景上文字清晰可见 */}
                <ColorPicker
                  color={currentStyles["primary-foreground"]}
                  onChange={(color) => updateStyle("primary-foreground", color)}
                  label="Primary Foreground"
                />
              </ControlSection>

              {/* 次要颜色设置区块 - 通常用于不那么强调的界面元素 */}
              <ControlSection title="Secondary Colors" expanded>
                <ColorPicker
                  color={currentStyles.secondary}
                  onChange={(color) => updateStyle("secondary", color)}
                  label="Secondary"
                />
                <ColorPicker
                  color={currentStyles["secondary-foreground"]}
                  onChange={(color) =>
                    updateStyle("secondary-foreground", color)
                  }
                  label="Secondary Foreground"
                />
              </ControlSection>

              {/* 强调色设置区块 - 用于吸引注意的元素，如高亮或特殊功能 */}
              <ControlSection title="Accent Colors">
                <ColorPicker
                  color={currentStyles.accent}
                  onChange={(color) => updateStyle("accent", color)}
                  label="Accent"
                />
                <ColorPicker
                  color={currentStyles["accent-foreground"]}
                  onChange={(color) => updateStyle("accent-foreground", color)}
                  label="Accent Foreground"
                />
              </ControlSection>

              {/* 基础颜色设置 - 整个网站的背景色和默认文字颜色 */}
              <ControlSection title="Base Colors">
                <ColorPicker
                  color={currentStyles.background}
                  onChange={(color) => updateStyle("background", color)}
                  label="Background"
                />
                <ColorPicker
                  color={currentStyles.foreground}
                  onChange={(color) => updateStyle("foreground", color)}
                  label="Foreground"
                />
              </ControlSection>

              {/* 卡片颜色设置 - 用于卡片、面板等UI元素 */}
              <ControlSection title="Card Colors">
                <ColorPicker
                  color={currentStyles.card}
                  onChange={(color) => updateStyle("card", color)}
                  label="Card Background"
                />
                <ColorPicker
                  color={currentStyles["card-foreground"]}
                  onChange={(color) => updateStyle("card-foreground", color)}
                  label="Card Foreground"
                />
              </ControlSection>

              {/* 弹出层颜色设置 - 用于下拉菜单、对话框等弹出元素 */}
              <ControlSection title="Popover Colors">
                <ColorPicker
                  color={currentStyles.popover}
                  onChange={(color) => updateStyle("popover", color)}
                  label="Popover Background"
                />
                <ColorPicker
                  color={currentStyles["popover-foreground"]}
                  onChange={(color) => updateStyle("popover-foreground", color)}
                  label="Popover Foreground"
                />
              </ControlSection>

              {/* 静音颜色设置 - 用于次要信息或禁用状态 */}
              <ControlSection title="Muted Colors">
                <ColorPicker
                  color={currentStyles.muted}
                  onChange={(color) => updateStyle("muted", color)}
                  label="Muted"
                />
                <ColorPicker
                  color={currentStyles["muted-foreground"]}
                  onChange={(color) => updateStyle("muted-foreground", color)}
                  label="Muted Foreground"
                />
              </ControlSection>

              {/* 危险操作颜色设置 - 用于删除、警告等需要注意的功能 */}
              <ControlSection title="Destructive Colors">
                <ColorPicker
                  color={currentStyles.destructive}
                  onChange={(color) => updateStyle("destructive", color)}
                  label="Destructive"
                />
                <ColorPicker
                  color={currentStyles["destructive-foreground"]}
                  onChange={(color) =>
                    updateStyle("destructive-foreground", color)
                  }
                  label="Destructive Foreground"
                />
              </ControlSection>

              {/* 边框和输入框颜色设置 */}
              <ControlSection title="Border & Input Colors">
                <ColorPicker
                  color={currentStyles.border}
                  onChange={(color) => updateStyle("border", color)}
                  label="Border"
                />
                <ColorPicker
                  color={currentStyles.input}
                  onChange={(color) => updateStyle("input", color)}
                  label="Input"
                />
                <ColorPicker
                  color={currentStyles.ring}
                  onChange={(color) => updateStyle("ring", color)}
                  label="Ring"
                />
              </ControlSection>

              {/* 图表颜色设置 - 用于数据可视化 */}
              <ControlSection title="Chart Colors">
                <ColorPicker
                  color={currentStyles["chart-1"]}
                  onChange={(color) => updateStyle("chart-1", color)}
                  label="Chart 1"
                />
                <ColorPicker
                  color={currentStyles["chart-2"]}
                  onChange={(color) => updateStyle("chart-2", color)}
                  label="Chart 2"
                />
                <ColorPicker
                  color={currentStyles["chart-3"]}
                  onChange={(color) => updateStyle("chart-3", color)}
                  label="Chart 3"
                />
                <ColorPicker
                  color={currentStyles["chart-4"]}
                  onChange={(color) => updateStyle("chart-4", color)}
                  label="Chart 4"
                />
                <ColorPicker
                  color={currentStyles["chart-5"]}
                  onChange={(color) => updateStyle("chart-5", color)}
                  label="Chart 5"
                />
              </ControlSection>

              {/* 侧边栏颜色设置 - 用于网站的侧边导航区域 */}
              <ControlSection title="Sidebar Colors">
                <ColorPicker
                  color={currentStyles.sidebar}
                  onChange={(color) => updateStyle("sidebar", color)}
                  label="Sidebar Background"
                />
                <ColorPicker
                  color={currentStyles["sidebar-foreground"]}
                  onChange={(color) => updateStyle("sidebar-foreground", color)}
                  label="Sidebar Foreground"
                />
                <ColorPicker
                  color={currentStyles["sidebar-primary"]}
                  onChange={(color) => updateStyle("sidebar-primary", color)}
                  label="Sidebar Primary"
                />
                <ColorPicker
                  color={currentStyles["sidebar-primary-foreground"]}
                  onChange={(color) =>
                    updateStyle("sidebar-primary-foreground", color)
                  }
                  label="Sidebar Primary Foreground"
                />
                <ColorPicker
                  color={currentStyles["sidebar-accent"]}
                  onChange={(color) => updateStyle("sidebar-accent", color)}
                  label="Sidebar Accent"
                />
                <ColorPicker
                  color={currentStyles["sidebar-accent-foreground"]}
                  onChange={(color) =>
                    updateStyle("sidebar-accent-foreground", color)
                  }
                  label="Sidebar Accent Foreground"
                />
                <ColorPicker
                  color={currentStyles["sidebar-border"]}
                  onChange={(color) => updateStyle("sidebar-border", color)}
                  label="Sidebar Border"
                />
                <ColorPicker
                  color={currentStyles["sidebar-ring"]}
                  onChange={(color) => updateStyle("sidebar-ring", color)}
                  label="Sidebar Ring"
                />
              </ControlSection>
            </TabsContent>

            {/* 排版设置标签页 - 控制字体和文本样式 */}
            <TabsContent value="typography" className="flex flex-col gap-4">
              {/* 信息提示框 - 关于如何使用自定义字体的说明 */}
              <div className="p-3 bg-muted/50 rounded-md border mb-2 flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>
                    To use custom fonts, embed them in your project. <br />
                    See{" "}
                    <a
                      href="https://tailwindcss.com/docs/font-family"
                      target="_blank"
                      className="underline underline-offset-2 hover:text-muted-foreground/90"
                    >
                      Tailwind docs
                    </a>{" "}
                    for details.
                  </p>
                </div>
              </div>

              {/* 字体系列设置区块 - 控制网站使用的不同类型字体 */}
              <ControlSection title="Font Family" expanded>
                {/* 无衬线字体设置 - 通常用于界面和正文 */}
                <div className="mb-4">
                  <Label htmlFor="font-sans" className="text-xs mb-1.5 block">
                    Sans-Serif Font
                  </Label>
                  <ThemeFontSelect
                    fonts={{ ...sansSerifFonts, ...serifFonts, ...monoFonts }}
                    defaultValue={DEFAULT_FONT_SANS}
                    currentFont={getAppliedThemeFont(themeState, "font-sans")}
                    onFontChange={(value) => updateStyle("font-sans", value)}
                  />
                </div>

                <Separator className="my-4" />

                {/* 衬线字体设置 - 通常用于标题或正式内容 */}
                <div className="mb-4">
                  <Label htmlFor="font-serif" className="text-xs mb-1.5 block">
                    Serif Font
                  </Label>
                  <ThemeFontSelect
                    fonts={{ ...serifFonts, ...sansSerifFonts, ...monoFonts }}
                    defaultValue={DEFAULT_FONT_SERIF}
                    currentFont={getAppliedThemeFont(themeState, "font-serif")}
                    onFontChange={(value) => updateStyle("font-serif", value)}
                  />
                </div>

                <Separator className="my-4" />

                {/* 等宽字体设置 - 通常用于代码或表格数据 */}
                <div>
                  <Label htmlFor="font-mono" className="text-xs mb-1.5 block">
                    Monospace Font
                  </Label>
                  <ThemeFontSelect
                    fonts={{ ...monoFonts, ...sansSerifFonts, ...serifFonts }}
                    defaultValue={DEFAULT_FONT_MONO}
                    currentFont={getAppliedThemeFont(themeState, "font-mono")}
                    onFontChange={(value) => updateStyle("font-mono", value)}
                  />
                </div>
              </ControlSection>

              {/* 字间距设置 - 控制文字之间的间距 */}
              <ControlSection title="Letter Spacing" expanded>
                <SliderWithInput
                  value={parseFloat(
                    currentStyles["letter-spacing"]?.replace("em", "")
                  )}
                  onChange={(value) =>
                    updateStyle("letter-spacing", `${value}em`)
                  }
                  min={-0.5} // 负值使字母靠得更紧
                  max={0.5}  // 正值使字母间距增大
                  step={0.025} // 每次调整的最小单位
                  unit="em" // 使用em作为单位，相对于字体大小
                  label="Letter Spacing"
                />
              </ControlSection>
            </TabsContent>

            {/* 其他设置标签页 - 控制圆角、间距和阴影 */}
            <TabsContent value="other">
              {/* 圆角设置 - 控制UI元素的圆角程度 */}
              <ControlSection title="Radius" expanded>
                <SliderWithInput
                  value={radius}
                  onChange={(value) => updateStyle("radius", `${value}rem`)}
                  min={0}      // 0表示没有圆角（直角）
                  max={5}      // 5rem是非常圆的角
                  step={0.025} // 调整的精度
                  unit="rem"   // 使用rem单位，相对于根元素字体大小
                  label="Radius"
                />
              </ControlSection>

              {/* 间距设置 - 控制UI元素之间的间隔 */}
              <ControlSection title="Spacing" expanded>
                <SliderWithInput
                  value={parseFloat(currentStyles.spacing?.replace("rem", ""))}
                  onChange={(value) => updateStyle("spacing", `${value}rem`)}
                  min={0.15}   // 最小间距
                  max={0.35}   // 最大间距
                  step={0.01}  // 调整精度
                  unit="rem"   // 单位
                  label="Spacing"
                />
              </ControlSection>
              
              {/* 阴影控制区 - 设置元素阴影的颜色、大小和位置 */}
              <div className="mt-6">
                <ShadowControl
                  shadowColor={currentStyles["shadow-color"]}
                  shadowOpacity={parseFloat(currentStyles["shadow-opacity"])}
                  shadowBlur={parseFloat(
                    currentStyles["shadow-blur"]?.replace("px", "")
                  )}
                  shadowSpread={parseFloat(
                    currentStyles["shadow-spread"]?.replace("px", "")
                  )}
                  shadowOffsetX={parseFloat(
                    currentStyles["shadow-offset-x"]?.replace("px", "")
                  )}
                  shadowOffsetY={parseFloat(
                    currentStyles["shadow-offset-y"]?.replace("px", "")
                  )}
                  onChange={(key, value) => {
                    // 根据不同类型的阴影属性，使用不同的更新方式
                    if (key === "shadow-color") {
                      // 颜色值直接更新
                      updateStyle(key, value as string);
                    } else if (key === "shadow-opacity") {
                      // 不透明度需要转为字符串
                      updateStyle(key, value.toString());
                    } else {
                      // 其他值需要加上px单位
                      updateStyle(key as keyof ThemeStyleProps, `${value}px`);
                    }
                  }}
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </>
  );
};

export default ThemeControlPanel;
