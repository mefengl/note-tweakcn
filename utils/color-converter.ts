/**
 * 颜色转换工具
 * 
 * 这个文件负责在不同的颜色格式之间进行转换。就像是一个颜色翻译官，
 * 能够把一种"颜色语言"转换成另一种"颜色语言"。
 * 
 * 在网页开发中，颜色可以用多种不同的格式表示：
 * - HEX: 十六进制格式，如 #FF0000（红色）
 * - RGB: 红绿蓝三原色格式，如 rgb(255, 0, 0)
 * - HSL: 色相、饱和度、亮度格式，如 hsl(0, 100%, 50%)
 * - OKLCH: 一种感知均匀的颜色格式，更符合人眼对颜色的感知
 * 
 * 不同的场景可能需要不同的颜色格式，这个工具让我们可以灵活地在这些格式间切换。
 */

import * as culori from "culori";  // 导入culori库，这是一个强大的颜色处理库
import { ColorFormat } from "../types";

/**
 * 格式化数字
 * 
 * 这个函数用来美化显示数字：
 * 1. 如果是整数（如5.0），则显示为"5"
 * 2. 如果是小数（如5.67），则保留两位小数，显示为"5.67"
 * 3. 如果数字不存在，则返回"0"
 * 
 * 就像是帮数字"化妆"，让它们看起来更整洁、更统一
 * 
 * @param num 需要格式化的数字
 * @returns 格式化后的数字字符串
 */
const formatNumber = (num?: number) => {
  if (!num) return "0";
  return num % 1 === 0 ? num : num.toFixed(2);
};

/**
 * 颜色格式转换器
 * 
 * 这是主要的颜色转换函数，可以将任何有效的颜色值转换为指定的格式。
 * 就像一个魔法机器，能把红色从一种表示方式变成另一种，但颜色本身保持不变。
 * 
 * 例如：
 * - 把 "#FF0000" 转换成 "0 100% 50%"（HSL格式）
 * - 把 "rgb(255, 0, 0)" 转换成 "#FF0000"（HEX格式）
 * 
 * @param colorValue 原始颜色值（任何有效的CSS颜色表示）
 * @param format 目标颜色格式（hsl、rgb、oklch或hex）
 * @param tailwindVersion Tailwind CSS版本（3或4），会影响HSL格式的输出
 * @returns 转换后的颜色字符串
 */
export const colorFormatter = (
  colorValue: string,
  format: ColorFormat = "hsl",
  tailwindVersion: "3" | "4" = "3"
): string => {
  try {
    // 使用culori解析颜色值
    const color = culori.parse(colorValue);
    if (!color) throw new Error("Invalid color input");

    // 根据目标格式进行转换
    switch (format) {
      case "hsl": {
        // 将颜色转换为HSL格式
        const hsl = culori.converter("hsl")(color);
        // Tailwind v4要求HSL格式带有"hsl()"前缀
        if (tailwindVersion === "4") {
          return `hsl(${formatNumber(hsl.h)} ${formatNumber(hsl.s * 100)}% ${formatNumber(hsl.l * 100)}%)`;
        }
        // Tailwind v3只需要HSL的值，不要前缀
        return `${formatNumber(hsl.h)} ${formatNumber(hsl.s * 100)}% ${formatNumber(hsl.l * 100)}%`;
      }
      case "rgb":
        // 转换为RGB格式，例如"rgb(64, 128, 192)"
        return culori.formatRgb(color);
      case "oklch": {
        // 转换为OKLCH格式
        const oklch = culori.converter("oklch")(color);
        return `oklch(${formatNumber(oklch.l)} ${formatNumber(oklch.c)} ${formatNumber(oklch.h)})`;
      }
      case "hex":
        // 转换为十六进制格式，例如"#4080c0"
        return culori.formatHex(color);
      default:
        // 如果指定了未知格式，则返回原始值
        return colorValue;
    }
  } catch (error) {
    // 如果转换过程出错，记录错误并返回原始值
    console.error(`Failed to convert color: ${colorValue}`, error);
    return colorValue;
  }
};

/**
 * 快速转换为HSL格式
 * 
 * 这是一个便捷函数，专门用于将颜色转换为HSL格式。
 * 相当于调用colorFormatter函数并指定format为"hsl"。
 * 
 * @param colorValue 原始颜色值
 * @returns HSL格式的颜色字符串
 */
export const convertToHSL = (colorValue: string): string =>
  colorFormatter(colorValue, "hsl");
