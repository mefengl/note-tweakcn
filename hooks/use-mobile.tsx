// 导入 React 库，使用其 useState 和 useEffect Hooks。
import * as React from "react";

// 定义移动设备的宽度断点（单位：像素）。
// 当浏览器窗口宽度小于这个值时，我们认为用户可能在使用移动设备。
// 768px 是一个常见的分界点，用于区分平板电脑/桌面和手机尺寸。
const MOBILE_BREAKPOINT = 768;

/**
 * 自定义 React Hook: useIsMobile
 * 
 * 这个 Hook 用于检测当前浏览器窗口是否处于“移动设备”尺寸。
 * 它通过检查窗口宽度是否小于预定义的 `MOBILE_BREAKPOINT` 来实现。
 * 
 * @returns 返回一个布尔值 (boolean)。`true` 表示当前窗口宽度小于断点（可能是移动设备），`false` 表示大于或等于断点。
 */
export function useIsMobile() {
  // 使用 useState 创建状态变量 `isMobile`。
  // 初始值设为 `undefined`，以处理服务器端渲染或首次客户端渲染前的情况。
  // 类型明确为 boolean | undefined。
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  // 使用 useEffect 在组件挂载后执行检查和设置监听器。
  // 空依赖数组 [] 表示此 effect 只在挂载时运行一次，卸载时运行清理函数。
  React.useEffect(() => {
    // 使用 window.matchMedia API 创建一个 MediaQueryList 对象。
    // 这个 API 用于检查 CSS 媒体查询的结果，并且可以在结果变化时触发事件。
    // 查询条件是 `(max-width: ${MOBILE_BREAKPOINT - 1}px)`，即宽度是否小于 768px。
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // 定义当媒体查询状态改变时触发的回调函数。
    const onChange = () => {
      // 在回调函数中，我们再次检查当前的 window.innerWidth。
      // 注意：虽然 mql.matches 也能提供媒体查询的当前状态，但这里选择了直接检查 innerWidth。
      // 这两种方法通常结果一致，但直接检查 innerWidth 可能更直观。
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // 为 MediaQueryList 对象添加 'change' 事件监听器。
    // 当媒体查询的结果从 true 变为 false 或反之时，会触发此事件。
    mql.addEventListener("change", onChange);

    // 在挂载时，立即进行一次检查并设置初始状态。
    // 这确保了即使没有发生尺寸变化，状态也能正确反映初始窗口大小。
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // 返回一个清理函数。
    // 这个函数会在组件卸载时被调用。
    return () => {
      // 在组件卸载时，移除之前添加的事件监听器，以避免内存泄漏。
      mql.removeEventListener("change", onChange);
    };
  }, []); // 空依赖数组确保只运行一次

  // 返回 isMobile 状态。
  // 使用双重否定 `!!` 将可能的 `undefined` 值转换为 `false`，
  // 同时保持 `true` 和 `false` 不变，确保返回值始终是布尔类型。
  return !!isMobile;
}
