/**
 * 从URL参数应用主题预设的自定义Hook
 * 
 * 这个Hook的作用是检查URL中是否包含主题预设参数，如果有则应用该主题，
 * 并从URL中移除该参数。这样用户可以通过分享带有特定主题参数的链接，让其他人直接看到相同的主题效果。
 * 
 * 工作原理：
 * 1. 使用nuqs库的useQueryState从URL中获取并操作名为"theme"的查询参数
 * 2. 从编辑器状态管理中获取应用主题预设的方法
 * 3. 当检测到URL中有主题参数时，应用该主题并清除URL参数
 * 
 * 举例：
 * - 当用户访问 https://tweakcn.com/editor?theme=dark 时，会自动应用dark主题并移除URL中的theme参数
 * - 这使得用户分享特定主题变得简单，接收链接的人不需要手动选择主题
 * 
 * 这种模式在许多支持状态共享的应用中很常见，比如在线设计工具、地图应用等，它们都会把当前状态编码到URL中
 */
import { useQueryState } from "nuqs";
import React from "react";
import { useEditorStore } from "@/store/editor-store";

export const useThemePresetFromUrl = () => {
  // 使用nuqs的useQueryState获取和设置URL中的"theme"参数
  // preset变量会包含URL中的theme参数值，setPreset函数可以修改这个参数
  const [preset, setPreset] = useQueryState("theme");
  
  // 从编辑器状态仓库中获取应用主题预设的函数
  // 这个函数用于将主题名称转换为实际的主题配置并应用到编辑器中
  const applyThemePreset = useEditorStore((state) => state.applyThemePreset);

  // 当组件挂载或preset/setPreset/applyThemePreset改变时执行的副作用
  React.useEffect(() => {
    // 如果URL中存在theme参数
    if (preset) {
      // 应用指定的主题预设
      applyThemePreset(preset);
      // 应用完后，从URL中移除theme参数，避免用户刷新页面时重复应用
      setPreset(null); // 将参数设为null会从URL中删除这个参数
    }
  }, [preset, setPreset, applyThemePreset]); // 依赖项列表
};
