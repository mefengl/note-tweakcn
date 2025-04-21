/**
 * 阴影效果生成工具
 * 
 * 在网页设计中，阴影就像物体在光照下产生的自然投影。
 * 这个工具负责生成各种大小和样式的阴影效果，让界面元素看起来更立体、更自然。
 * 
 * 阴影的组成部分：
 * 1. 偏移量(offset) - 阴影相对于元素的位置
 * 2. 模糊度(blur) - 阴影的柔和程度
 * 3. 扩散(spread) - 阴影的大小
 * 4. 颜色(color) - 阴影的颜色和透明度
 */

import { colorFormatter } from "./color-converter";
import { applyStyleToElement } from "./apply-style-to-element";
import { ThemeEditorState } from "../types/theme";
import { defaultThemeState } from "../config/theme";

/**
 * 生成阴影样式映射表
 * 
 * 这个函数就像一个阴影工厂，根据用户的设置生成不同尺寸的阴影效果。
 * 每种阴影都有其特定的用途，从最细微的2xs到最夸张的2xl。
 * 
 * @param themeEditorState 主题编辑器的当前状态
 * @returns 包含各种阴影样式的映射表
 */
export const getShadowMap = (themeEditorState: ThemeEditorState) => {
  // 获取当前主题模式（明亮/暗黑）的样式
  const mode = themeEditorState.currentMode;
  const styles = {
    ...defaultThemeState.styles[mode],
    ...themeEditorState.styles[mode],
  };

  // 提取阴影的基本属性
  const shadowColor = styles["shadow-color"];
  const hsl = colorFormatter(shadowColor, "hsl", "3");
  const offsetX = styles["shadow-offset-x"];
  const offsetY = styles["shadow-offset-y"];
  const blur = styles["shadow-blur"];
  const spread = styles["shadow-spread"];
  const opacity = parseFloat(styles["shadow-opacity"]);

  /**
   * 生成阴影颜色
   * 通过调整不同的透明度，可以创造出层次感
   * 
   * @param opacityMultiplier 透明度的倍率
   * @returns HSL格式的颜色值
   */
  const color = (opacityMultiplier: number) =>
    `hsl(${hsl} / ${(opacity * opacityMultiplier).toFixed(2)})`;

  /**
   * 生成双层阴影的第二层
   * 双层阴影可以创造更真实的深度效果
   * 
   * @param fixedOffsetY 固定的Y轴偏移量
   * @param fixedBlur 固定的模糊值
   * @returns 第二层阴影的CSS值
   */
  const secondLayer = (fixedOffsetY: string, fixedBlur: string): string => {
    const offsetX2 = offsetX;  // 保持与第一层相同的X轴偏移
    const offsetY2 = fixedOffsetY;  // 使用指定的Y轴偏移
    const blur2 = fixedBlur;  // 使用指定的模糊值
    // 计算相对于第一层的扩散值
    const spread2 =
      (parseFloat(spread?.replace("px", "") ?? "0") - 1).toString() + "px";
    const color2 = color(1.0);  // 第二层使用标准透明度

    return `${offsetX2} ${offsetY2} ${blur2} ${spread2} ${color2}`;
  };

  // 定义不同尺寸的阴影样式
  const shadowMap: { [key: string]: string } = {
    // 单层阴影 - 直接使用基础变量
    "shadow-2xs": `${offsetX} ${offsetY} ${blur} ${spread} ${color(0.5)}`,  // 最小的阴影
    "shadow-xs": `${offsetX} ${offsetY} ${blur} ${spread} ${color(0.5)}`,   // 超小阴影
    "shadow-2xl": `${offsetX} ${offsetY} ${blur} ${spread} ${color(2.5)}`,  // 最大的阴影

    // 双层阴影 - 第一层用基础变量，第二层混合固定值和计算值
    "shadow-sm": `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer("1px", "2px")}`,  // 小阴影
    shadow: `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer("1px", "2px")}`,  // 默认阴影

    "shadow-md": `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer("2px", "4px")}`,  // 中等阴影

    "shadow-lg": `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer("4px", "6px")}`,  // 大阴影

    "shadow-xl": `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer("8px", "10px")}`,  // 特大阴影
  };

  return shadowMap;
};

/**
 * 设置阴影的CSS变量
 * 
 * 这个函数会将生成的阴影样式映射表应用到HTML根元素上。
 * 通过CSS变量，网页可以动态调整阴影效果。
 * 
 * @param themeEditorState 主题编辑器的当前状态
 */
export function setShadowVariables(themeEditorState: ThemeEditorState) {
  const root = document.documentElement;

  const shadows = getShadowMap(themeEditorState);
  Object.entries(shadows).forEach(([name, value]) => {
    applyStyleToElement(root, name, value);
  });
}
