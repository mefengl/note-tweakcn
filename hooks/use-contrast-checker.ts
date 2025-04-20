// 导入 React 的核心 Hook: useState 用于管理状态，useEffect 用于处理副作用，useCallback 用于记忆回调函数。
import { useState, useEffect, useCallback } from "react";
// 导入实际计算对比度的函数。
import { getContrastRatio } from "../utils/contrast-checker";
// 导入防抖函数，用于限制函数调用的频率。
import { debounce } from "../utils/debounce";

// 定义颜色对的数据结构类型。
// 每个颜色对都有一个唯一的标识符 (id)，以及前景和背景的颜色值（字符串形式，例如 '#FFFFFF' 或 'rgb(0,0,0)'）。
type ColorPair = {
  id: string;
  foreground: string;
  background: string;
};

// 定义对比度计算结果的数据结构类型。
// 每个结果包含对应颜色对的 id 和计算出的对比度数值。
type ContrastResult = {
  id: string;
  contrastRatio: number; // 对比度是一个数值
};

/**
 * 自定义 Hook：用于计算一组颜色对（前景/背景）的对比度。
 * 这个 Hook 对计算过程进行了防抖处理，以提高性能。
 * 
 * @param colorPairs - 一个包含多个颜色对对象的数组。每个对象需要符合 `ColorPair` 类型定义。
 *                     例如: [{ id: 'text-on-button', foreground: '#FFFFFF', background: '#007bff' }, ...]
 * @returns 返回一个数组，包含每个颜色对的 `id` 和计算得到的 `contrastRatio`。数组的顺序与输入 `colorPairs` 的顺序一致。
 *          如果计算出错或输入为空，则返回空数组。
 */
export function useContrastChecker(colorPairs: ColorPair[]) {
  // 使用 useState 创建一个状态变量 `contrastResults`，用于存储计算出的对比度结果数组。
  // 初始值为空数组。
  const [contrastResults, setContrastResults] = useState<ContrastResult[]>([]);

  // 使用 useCallback 和 debounce 创建一个记忆化的、防抖的计算函数。
  // useCallback 确保 debouncedCalculation 函数实例在依赖项未改变时不会重新创建。
  // debounce 确保内部的计算逻辑（匿名函数）只在连续调用停止 750ms 后执行一次。
  const debouncedCalculation = useCallback(
    debounce((pairs: ColorPair[]) => {
      // 如果输入的颜色对数组为空，则直接清空结果并返回。
      if (!pairs.length) {
        setContrastResults([]);
        return;
      }

      try {
        // 遍历输入的颜色对数组。
        const results = pairs.map((pair) => {
          // 调用 getContrastRatio 函数计算前景和背景色之间的对比度。
          // parseFloat 用于确保结果是数字类型。
          const ratio = parseFloat(
            getContrastRatio(pair.foreground, pair.background)
          );
          // 返回包含 id 和计算出的对比度的结果对象。
          return {
            id: pair.id,
            contrastRatio: ratio,
          };
        });

        // 使用 setContrastResults 更新状态，存储计算出的所有结果。
        setContrastResults(results);
      } catch (error) {
        // 如果在计算过程中发生任何错误（例如颜色格式无效导致 getContrastRatio 抛错）。
        // 在控制台打印错误信息。
        console.error("Error checking contrast:", error);
        // 并将结果状态清空，避免显示错误或过时的信息。
        setContrastResults([]);
      }
    }, 750), // 防抖延迟时间设置为 750 毫秒。
    [] // useCallback 的依赖项为空数组，表示这个 debouncedCalculation 函数实例只在组件首次渲染时创建一次。
  );

  // 使用 useEffect 来监听输入的 `colorPairs` 是否发生变化。
  // 当 colorPairs 或 debouncedCalculation (理论上仅首次创建) 改变时，这个 effect 会执行。
  useEffect(() => {
    // 调用防抖函数，传入当前的 colorPairs。
    // 这不会立即执行计算，而是会启动或重置防抖计时器。
    debouncedCalculation(colorPairs);
  }, [colorPairs, debouncedCalculation]); // effect 的依赖项数组。

  // 返回当前存储在状态中的对比度结果数组。
  // 组件会随着 contrastResults 状态的更新而重新渲染，显示最新的对比度信息。
  return contrastResults;
}
