/**
 * 用户偏好设置状态管理文件
 * 
 * 这个文件使用Zustand库实现了用户偏好设置的状态管理，包括用户界面和代码生成偏好。
 * 所有设置都会通过persist中间件持久化到localStorage中，确保用户下次访问时保留设置。
 * 这些偏好设置影响整个应用的行为，如生成代码的格式和工具选择。
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ColorFormat } from "@/types";

/**
 * 包管理器类型
 * 
 * 定义支持的几种JavaScript/Node.js包管理器:
 * - pnpm: 性能更好的npm替代品
 * - npm: Node.js默认包管理器
 * - yarn: Facebook开发的npm替代品
 * - bun: 新一代JavaScript运行时和包管理器
 */
type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

/**
 * 用户偏好设置存储接口
 * 
 * 定义了偏好设置存储需要提供的所有属性和方法:
 * - Tailwind CSS版本选择
 * - 颜色格式选择
 * - 包管理器选择
 * - 以及修改这些设置的方法
 */
interface PreferencesStore {
  tailwindVersion: "3" | "4";           // 使用的Tailwind CSS版本
  colorFormat: ColorFormat;             // 颜色格式偏好
  packageManager: PackageManager;       // 首选包管理器
  setTailwindVersion: (version: "3" | "4") => void;  // 设置Tailwind版本
  setColorFormat: (format: ColorFormat) => void;     // 设置颜色格式
  setPackageManager: (pm: PackageManager) => void;   // 设置包管理器
}

/**
 * 用户偏好设置存储实例
 * 
 * 使用Zustand的create函数创建状态存储，同时通过persist中间件实现状态持久化。
 * 这个存储实例提供了以下功能:
 * 
 * 1. 存储用户偏好设置
 * 2. 提供修改各项设置的方法
 * 3. 自动将设置保存到localStorage
 * 
 * 初始默认值设置为:
 * - Tailwind CSS版本: 4
 * - 颜色格式: oklch (一种更现代的颜色格式，支持更广色域)
 * - 包管理器: pnpm
 */
export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      tailwindVersion: "4",          // 默认使用Tailwind CSS v4
      colorFormat: "oklch",          // 默认使用oklch颜色格式
      packageManager: "pnpm",        // 默认使用pnpm包管理器

      /**
       * 设置Tailwind CSS版本
       * @param version Tailwind版本，可选值: "3" 或 "4"
       */
      setTailwindVersion: (version: "3" | "4") => {
        set({ tailwindVersion: version });
      },

      /**
       * 设置颜色格式
       * @param format 颜色格式，如"hex"、"rgb"、"hsl"或"oklch"等
       */
      setColorFormat: (format: ColorFormat) => {
        set({ colorFormat: format });
      },

      /**
       * 设置首选包管理器
       * @param pm 包管理器，可选值: "pnpm"、"npm"、"yarn"或"bun"
       */
      setPackageManager: (pm: PackageManager) => {
        set({ packageManager: pm });
      },
    }),
    {
      name: "preferences-storage", // localStorage中的唯一存储名称
    }
  )
);