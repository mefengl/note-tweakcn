/**
 * PostCSS 配置文件
 * 
 * PostCSS 是一个用 JavaScript 转换 CSS 的工具
 * 在这个项目中主要用于：
 * 1. 处理 Tailwind CSS
 * 2. 自动添加浏览器前缀
 * 3. 优化和压缩 CSS
 * 
 * 这个配置非常简单，只使用了 Tailwind 的 PostCSS 插件
 * 该插件会：
 * - 处理所有的 Tailwind 指令（@tailwind）
 * - 处理所有的 Tailwind 类名
 * - 生成最终的 CSS 文件
 */

const config = {
  plugins: ["@tailwindcss/postcss"], // 启用 Tailwind CSS 的 PostCSS 插件
};

export default config;
