// 导入 clsx 库，它用于方便地、有条件地合并 CSS 类名。
// ClassValue 是 clsx 库定义的类型，表示可以作为类名输入的各种值（字符串、对象、数组等）。
import { clsx, type ClassValue } from "clsx";
// 导入 tailwind-merge 库，它用于智能合并 Tailwind CSS 类，解决冲突并优化最终的类名字符串。
import { twMerge } from "tailwind-merge";

/**
 * 合并 CSS 类名的辅助函数。
 * 
 * 这个函数结合了 `clsx` 和 `tailwind-merge` 的功能。
 * 1. `clsx` 允许你灵活地传入类名，包括条件性地添加类名。
 *    例如: cn('base-class', { 'active-class': isActive }, ['p-4', 'm-2'])
 * 2. `tailwind-merge` 会处理 `clsx` 生成的类名字符串，确保 Tailwind 的功能类（utility classes）
 *    不会相互冲突。比如，如果你同时传入了 'px-2' 和 'px-4'，它会确保最终只有 'px-4' 被应用。
 * 
 * @param inputs - 一个或多个类名值。可以是字符串、对象（键是类名，值是布尔值决定是否包含该类名）、
 *                 数组（包含类名字符串或其他有效输入），甚至是 null 或 undefined（会被忽略）。
 * @returns - 一个经过合并和优化处理的最终 CSS 类名字符串。
 */
export function cn(...inputs: ClassValue[]) {
  // 首先使用 clsx 处理所有输入，生成一个初步的类名字符串。
  // 然后将这个字符串传递给 twMerge 进行优化和冲突解决。
  return twMerge(clsx(inputs));
}
