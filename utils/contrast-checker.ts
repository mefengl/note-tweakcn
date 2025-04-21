/**
 * 颜色对比度检查工具
 * 
 * 这个文件用来检查两种颜色之间的对比度，确保它们在一起使用时足够清晰可见。
 * 
 * 想象一下，如果我们把文字颜色和背景颜色看作是两个人站在一起，对比度就是衡量
 * 这两个人"有多容易被区分出来"的指标。如果对比度太低，就像两个穿着相似颜色衣服
 * 的人站在一起，会很难分辨；对比度高的话，就像一个穿黑衣服、一个穿白衣服的人，
 * 非常容易区分。
 * 
 * 在网页设计中，良好的对比度对于可访问性（accessibility）非常重要，
 * 尤其是对于视力不好的用户。WCAG（Web内容可访问性指南）规定了最小对比度标准：
 * - 普通文本至少需要4.5:1的对比度
 * - 大型文本至少需要3:1的对比度
 */

import * as culori from "culori";

/**
 * 计算颜色的亮度（根据WCAG标准）
 * 
 * 亮度是指颜色"有多亮"，在0到1之间，1是最亮的（白色），0是最暗的（黑色）。
 * 这个计算并不是简单地看颜色有多"白"，而是考虑了人眼对不同颜色亮度的感知差异。
 * 
 * 例如，对于相同亮度的颜色，人眼会觉得绿色比蓝色更亮，这个函数会考虑这种差异。
 * 
 * @param colorValue - 任何支持格式的颜色值
 * @returns 颜色的相对亮度（0-1之间）
 */
function getLuminance(colorValue: string): number {
  try {
    // 使用culori库解析颜色
    const color = culori.parse(colorValue);
    if (!color) {
      console.warn(`Invalid color: ${colorValue}`);
      return 0;
    }

    // Culori提供了直接计算WCAG标准亮度的方法
    return culori.wcagLuminance(color);
  } catch (error) {
    console.error(`Error calculating luminance: ${colorValue}`, error);
    return 0;
  }
}

/**
 * 计算两种颜色之间的对比度（根据WCAG指南）
 * 
 * 对比度是衡量两种颜色之间"区分度"的数值。
 * 对比度的范围从1:1（没有对比，如相同的颜色）到21:1（最大对比，如纯黑和纯白）。
 * 
 * 对比度与可访问性等级对应关系：
 * - 小于3:1 - 不满足任何可访问性标准
 * - 3:1到4.5:1 - 满足AA级标准（大文本）
 * - 4.5:1到7:1 - 满足AA级标准（所有文本）和AAA级标准（大文本）
 * - 7:1或更高 - 满足AAA级标准（所有文本）
 * 
 * @param color1 - 第一个颜色（任何格式）
 * @param color2 - 第二个颜色（任何格式）
 * @returns 对比度比值的字符串表示（如"4.50"）
 */
export function getContrastRatio(color1: string, color2: string): string {
  try {
    // 获取两个颜色的亮度
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);

    // 使用WCAG对比度公式计算
    // (亮色+0.05)/(暗色+0.05)
    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    return ratio.toFixed(2);  // 保留两位小数
  } catch (error) {
    console.error(
      `Error calculating contrast between ${color1} and ${color2}:`,
      error
    );
    return "1.00"; // 返回表示低对比度的默认值
  }
}
