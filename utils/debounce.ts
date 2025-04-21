/**
 * 函数防抖工具
 * 
 * 防抖的概念就像电梯：
 * - 当有人按电梯时，电梯不会立即运行，而是等待一小段时间
 * - 如果在这段时间内又有人按电梯，就会重新计时
 * - 只有当一段时间内没有人按电梯，电梯才会开始运行
 * 
 * 在前端开发中，防抖常用于处理：
 * - 搜索框输入时的API调用
 * - 窗口调整大小时的重新计算
 * - 表单提交按钮的多次点击
 * 
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数，包含一个cancel方法用于取消等待中的调用
 * 
 * @example
 * // 创建一个防抖的搜索函数
 * const debouncedSearch = debounce((query) => {
 *   fetchSearchResults(query);
 * }, 300);
 * 
 * // 在输入框onChange时调用
 * input.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value);
 * });
 * 
 * // 如果需要取消等待中的搜索
 * debouncedSearch.cancel();
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T & { cancel: () => void } {
  // 保存定时器ID
  let timeoutId: NodeJS.Timeout;

  // 创建防抖函数
  const debounced = function (this: unknown, ...args: Parameters<T>) {
    // 清除之前的定时器
    clearTimeout(timeoutId);
    // 设置新的定时器
    timeoutId = setTimeout(() => {
      // 用原始的this上下文和参数调用函数
      fn.apply(this, args);
    }, delay);
  } as T & { cancel: () => void };

  // 添加取消方法
  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}
