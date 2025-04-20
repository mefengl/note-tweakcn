// 导入 React 的 useState 和 useEffect Hooks。
import { useState, useEffect } from "react";
// 导入 screenfull 库。这是一个流行的库，用于简化跨浏览器处理 Fullscreen API 的复杂性。
// Fullscreen API 允许网页或应用程序的某个部分（甚至是整个页面）进入全屏模式。
import screenfull from "screenfull";

/**
 * 自定义 React Hook: useFullscreen
 * 
 * 这个 Hook 封装了浏览器的 Fullscreen API，提供了一种简单的方式来：
 * 1. 检查当前是否处于全屏状态。
 * 2. 切换进入或退出全屏模式。
 * 
 * 它使用了 `screenfull` 库来处理不同浏览器之间的兼容性问题。
 * 
 * @returns 返回一个包含以下内容的对象：
 *   - `isFullscreen` (boolean): 一个状态值，表示当前是否处于全屏模式。`true` 表示是，`false` 表示否。
 *   - `toggleFullscreen` (function): 一个函数，调用它可以切换全屏状态（进入或退出）。
 */
export const useFullscreen = () => {
  // 使用 useState 创建一个状态变量 `isFullscreen`，初始值为 false（非全屏）。
  // 这个状态会反映当前是否处于全屏模式。
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 使用 useEffect 设置事件监听器，并在组件卸载时清理。
  // 空依赖数组 [] 意味着这个 effect 只在组件首次挂载时运行一次，以及在卸载时运行清理函数。
  useEffect(() => {
    // 首先检查当前环境是否支持并启用了 Fullscreen API。
    // screenfull.isEnabled 会进行这个检查。
    if (screenfull.isEnabled) {
      // 定义当全屏状态改变时要执行的处理函数。
      const handleFullscreenChange = () => {
        // 当浏览器触发 'change' 事件时，这个函数会被调用。
        // 我们需要读取 screenfull.isFullscreen 的最新值来更新我们的 React 状态。
        setIsFullscreen(screenfull.isFullscreen);
      };

      // 使用 screenfull.on() 方法来监听 'change' 事件。
      // 这个事件在进入或退出全屏时触发。
      screenfull.on("change", handleFullscreenChange);

      // useEffect 返回的函数是清理函数。
      // 它会在组件卸载时执行。
      return () => {
        // 在组件卸载时，移除之前添加的事件监听器，防止内存泄漏。
        screenfull.off("change", handleFullscreenChange);
      };
    }
  }, []); // 空依赖数组，确保 effect 只运行一次

  // 定义一个函数，用于切换全屏状态。
  const toggleFullscreen = () => {
    // 再次检查 Fullscreen API 是否可用。
    if (screenfull.isEnabled) {
      // 调用 screenfull.toggle()。
      // 这个方法会自动处理进入或退出全屏的逻辑。
      // 如果当前不是全屏，它会尝试请求进入全屏；如果当前是全屏，它会退出全屏。
      // 注意：请求进入全屏可能需要用户交互（例如点击按钮）才能成功。
      screenfull.toggle();
    }
  };

  // Hook 返回一个对象，包含当前的全屏状态和切换函数。
  // 使用这个 Hook 的组件可以通过解构赋值获取它们，例如：
  // const { isFullscreen, toggleFullscreen } = useFullscreen();
  return {
    isFullscreen,
    toggleFullscreen,
  };
};
