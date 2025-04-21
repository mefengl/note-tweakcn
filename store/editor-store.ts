/**
 * 编辑器状态管理文件
 * 
 * 这个文件使用Zustand库实现了编辑器状态的管理，包括主题状态的存储、修改和持久化。
 * Zustand是一个轻量级的状态管理库，类似Redux但更简单，它提供了一个中心化的状态存储，
 * 便于跨组件共享状态，同时支持通过中间件实现额外功能，如状态持久化。
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeEditorState } from "@/types/editor";
import { ThemeStyleProps } from "@/types/theme";
// @ts-expect-error: owned by ngard
import { isEqual } from "@ngard/tiny-isequal";
import { defaultThemeState, COMMON_STYLES } from "@/config/theme";
import { getPresetThemeStyles } from "@/utils/theme-presets";

/**
 * 编辑器状态存储接口
 * 
 * 定义了编辑器状态存储需要提供的所有属性和方法。
 * 包括:
 * - 当前主题状态
 * - 修改主题状态的方法
 * - 应用主题预设的方法
 * - 重置主题的方法
 * - 检查主题变更状态的方法
 */
interface EditorStore {
  themeState: ThemeEditorState;            // 当前的主题编辑器状态
  setThemeState: (state: ThemeEditorState) => void;  // 设置新的主题状态
  applyThemePreset: (preset: string) => void;  // 应用指定的主题预设
  resetToDefault: () => void;              // 重置到默认主题
  resetToCurrentPreset: () => void;        // 重置到当前选择的预设主题
  hasDefaultThemeChanged: () => boolean;   // 检查当前主题是否与默认主题不同
  hasCurrentPresetChanged: () => boolean;  // 检查当前主题是否与当前预设不同
  hasChangedThemeFromDefault: boolean;     // 标记是否已从默认主题更改过
}

/**
 * 编辑器状态存储实例
 * 
 * 使用Zustand的create函数创建状态存储，同时通过persist中间件实现状态持久化。
 * 这个存储实例提供了一系列方法来操作主题状态:
 * 
 * 1. setThemeState: 直接设置完整的主题状态
 * 2. applyThemePreset: 应用预定义的主题预设
 * 3. resetToDefault: 重置回默认主题
 * 4. resetToCurrentPreset: 重置到当前选择的预设主题
 * 5. hasDefaultThemeChanged: 检查是否已修改默认主题
 * 6. hasCurrentPresetChanged: 检查是否已修改当前预设主题
 */
export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      themeState: defaultThemeState,  // 初始化为默认主题状态
      hasChangedThemeFromDefault: false,  // 初始未改变标志

      /**
       * 设置新的主题编辑器状态
       * @param state 新的主题编辑器状态对象
       */
      setThemeState: (state: ThemeEditorState) => {
        set({ themeState: state });
      },

      /**
       * 应用指定名称的预设主题
       * 
       * 会更新当前主题状态，替换为指定预设的样式，
       * 同时记录当前使用的预设名称。
       * 如果切换到非默认预设，会设置hasChangedThemeFromDefault标志。
       * 
       * @param preset 预设主题的名称
       */
      applyThemePreset: (preset: string) => {
        const themeState = get().themeState;
        const updates: Partial<EditorStore> = {
          themeState: {
            ...themeState,
            preset,
            styles: getPresetThemeStyles(preset),  // 获取预设主题样式
          },
        };
        if (preset !== "default") {
          updates.hasChangedThemeFromDefault = true;  // 标记已从默认主题更改
        }
        set(updates);
      },

      /**
       * 重置到默认主题
       * 
       * 保留当前的主题模式(亮色/暗色)，但将所有样式重置为默认值。
       */
      resetToDefault: () => {
        const mode = get().themeState.currentMode;
        set({ themeState: { ...defaultThemeState, currentMode: mode } });
      },

      /**
       * 重置到当前选择的预设主题
       * 
       * 不改变预设选择，但将所有样式重置为当前预设的原始样式。
       * 用于放弃对当前预设的自定义修改。
       */
      resetToCurrentPreset: () => {
        const themeState = get().themeState;
        set({
          themeState: {
            ...themeState,
            styles: getPresetThemeStyles(themeState.preset || "default"),
          },
        });
      },

      /**
       * 检查当前主题是否与默认主题不同
       * 
       * 通过深度比较当前主题样式和默认主题样式来判断。
       * 
       * @returns {boolean} 若有变更返回true，否则返回false
       */
      hasDefaultThemeChanged: () => {
        const state = get();
        return !isEqual(state.themeState.styles, defaultThemeState.styles);
      },

      /**
       * 检查当前主题是否与当前预设的原始主题不同
       * 
       * 通过深度比较当前主题样式和预设主题原始样式来判断。
       * 
       * @returns {boolean} 若有变更返回true，否则返回false
       */
      hasCurrentPresetChanged: () => {
        const state = get();
        const presetStyles = getPresetThemeStyles(
          state.themeState.preset || "default"
        );
        return !isEqual(state.themeState.styles, presetStyles);
      },
    }),
    {
      name: "editor-storage", // localStorage中的唯一存储名称
    }
  )
);
