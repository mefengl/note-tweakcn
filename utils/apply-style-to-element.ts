/**
 * DOM 元素样式应用工具
 * 
 * 这个工具函数用于动态地将 CSS 变量应用到 DOM 元素上。
 * 它会保留元素现有的样式，并追加新的 CSS 变量。
 * 
 * 工作原理：
 * 1. 获取元素当前的 style 属性值
 * 2. 将新的 CSS 变量添加到现有样式中
 * 3. 使用 setAttribute 更新元素的 style 属性
 * 
 * @param element - 要应用样式的 DOM 元素
 * @param key - CSS 变量名（不需要包含 -- 前缀）
 * @param value - CSS 变量的值
 * 
 * @example
 * // 将主题颜色应用到按钮元素
 * const button = document.querySelector('button');
 * applyStyleToElement(button, 'primary-color', '#ff0000');
 * // 结果：<button style="--primary-color: #ff0000;">
 */
export function applyStyleToElement(
  element: HTMLElement,
  key: string,
  value: string
) {
  element.setAttribute(
    `style`,
    `${element.getAttribute("style") || ""}--${key}: ${value};`
  );
}
