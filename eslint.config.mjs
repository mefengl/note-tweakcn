/**
 * ESLint 配置文件（新版扁平配置格式）
 * 
 * 这个配置文件使用了 ESLint 的新版扁平配置系统，是一个现代化的 JavaScript/TypeScript 代码检查工具的配置。
 * 
 * 主要功能：
 * 1. 继承 Next.js 推荐的核心规则集，确保代码符合 Next.js 的最佳实践
 * 2. 配置 TypeScript 相关的代码规范检查
 * 3. 自定义规则以适应项目特定需求
 * 
 * 技术要点：
 * - 使用 ESM (ECMAScript Modules) 格式编写
 * - 采用新的扁平配置系统，不再使用 .eslintrc.* 文件
 * - 通过 FlatCompat 支持传统配置的兼容性
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

/**
 * ESM 环境下获取文件路径
 * 
 * 由于 ESM 不支持 CommonJS 的 __dirname，需要手动实现：
 * 1. fileURLToPath: 将 file:// URL 转换为文件路径
 * 2. dirname: 获取文件所在目录的路径
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 创建兼容层实例
 * FlatCompat 允许在新的扁平配置系统中使用传统的 ESLint 配置
 * 这对于使用一些还未完全适配新系统的插件很重要
 */
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 继承 Next.js 的推荐配置
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      /**
       * 自定义规则配置
       * 
       * @next/next/no-page-custom-font: "off"
       * 允许使用自定义字体，关闭 Next.js 的字体优化警告
       * 原因：项目可能需要使用特定的自定义字体，而不仅仅依赖 Next.js 的字体优化
       * 
       * @next/next/no-img-element: "off"
       * 允许使用普通的 img 标签，而不强制使用 next/image
       * 原因：有些场景下可能不需要 Next.js 的图片优化功能
       * 
       * @typescript-eslint/no-empty-object-type: "off"
       * 允许定义空对象类型，这在 TypeScript 中有时很有用
       * 例如：声明一个不包含任何属性的纯标记接口
       */
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      
      /**
       * TypeScript 未使用变量的严格检查配置
       * 这个规则帮助我们保持代码整洁，避免存在未使用的变量
       * 
       * 配置说明：
       * - args: "all" - 检查所有函数参数是否被使用
       * - argsIgnorePattern: "^_" - 忽略以下划线开头的参数，这是一种常见的表示"我知道这个参数存在但不会使用"的约定
       * - caughtErrors: "all" - 检查 catch 语句中的错误参数是否被使用
       * - caughtErrorsIgnorePattern: "^_" - 同样忽略以下划线开头的错误参数
       * - destructuredArrayIgnorePattern: "^_" - 在数组解构中忽略以下划线开头的变量
       * - varsIgnorePattern: "^_" - 忽略以下划线开头的普通变量
       * - ignoreRestSiblings: true - 在对象解构中忽略剩余属性的未使用字段
       * 
       * 示例：
       * function example(_unused, { used, _unused2, ...rest }) {
       *   console.log(used); // 只使用 used 变量是允许的
       * }
       */
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",                           
          argsIgnorePattern: "^_",              
          caughtErrors: "all",                   
          caughtErrorsIgnorePattern: "^_",       
          destructuredArrayIgnorePattern: "^_",   
          varsIgnorePattern: "^_",              
          ignoreRestSiblings: true,             
        },
      ],
    },
  },
];

export default eslintConfig;
