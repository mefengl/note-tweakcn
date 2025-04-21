/**
 * Toast 通知系统
 * 这是一个用于管理弹出式通知（Toast）的自定义 Hook
 * 
 * 主要功能：
 * 1. 支持添加、更新、关闭和移除 toast
 * 2. 自动限制同时显示的 toast 数量
 * 3. 提供完整的类型支持
 * 4. 自动管理 toast 的生命周期
 * 
 * 使用场景示例：
 * - 操作成功/失败的提示
 * - 系统通知
 * - 临时性的用户反馈
 */

"use client";

import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// 系统配置常量
const TOAST_LIMIT = 1;  // 同时显示的 toast 最大数量
const TOAST_REMOVE_DELAY = 1000000;  // toast 自动移除的延迟时间（毫秒）

/**
 * Toast 的完整类型定义
 * 继承自基础 ToastProps，并添加了额外的必要属性
 */
type ToasterToast = ToastProps & {
  id: string;                    // toast 的唯一标识
  title?: React.ReactNode;       // toast 的标题
  description?: React.ReactNode; // toast 的详细描述
  action?: ToastActionElement;   // toast 的操作按钮
};

/**
 * 定义所有可能的 action 类型
 * 使用 as const 确保类型的字面量性质
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",         // 添加新的 toast
  UPDATE_TOAST: "UPDATE_TOAST",   // 更新已存在的 toast
  DISMISS_TOAST: "DISMISS_TOAST", // 关闭 toast（触发移除倒计时）
  REMOVE_TOAST: "REMOVE_TOAST",   // 从系统中完全移除 toast
} as const;

// 用于生成唯一 ID 的计数器
let count = 0;

/**
 * 生成唯一的 toast ID
 * 使用简单的递增计数器，并在达到最大安全整数时重置
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

/**
 * Redux 风格的 Action 类型定义
 * 使用联合类型来定义所有可能的 action
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

/**
 * Toast 系统的状态接口
 */
interface State {
  toasts: ToasterToast[];  // 当前显示的所有 toasts
}

// 存储所有 toast 的移除定时器
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * 将 toast 添加到移除队列
 * 为每个 toast 设置一个定时器，在指定时间后自动移除
 * @param toastId 要移除的 toast 的 ID
 */
const addToRemoveQueue = (toastId: string) => {
  // 如果该 toast 已经在移除队列中，直接返回
  if (toastTimeouts.has(toastId)) {
    return;
  }

  // 设置定时器，在延迟后移除 toast
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  // 将定时器存储在 Map 中以便后续管理
  toastTimeouts.set(toastId, timeout);
};

/**
 * Toast 系统的 reducer
 * 处理所有 toast 相关的状态更新
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // 添加新的 toast 到队列开头，并保持数量限制
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      // 更新指定 ID 的 toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // 将指定的 toast（或所有 toast）添加到移除队列
      // 注意：这里包含副作用，理论上可以抽取为单独的 action
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      // 如果没有指定 toastId，清空所有 toasts
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      // 否则只移除指定 ID 的 toast 
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

/**
 * 状态管理系统
 * 使用发布-订阅模式实现的简单状态管理
 */
// 存储所有状态变更的监听函数
const listeners: Array<(state: State) => void> = [];

// 内存中维护的全局状态
let memoryState: State = { toasts: [] };

/**
 * 派发 action 并通知所有监听者
 * 这是一个简化版的 Redux dispatch 实现
 * 
 * @param action - 要执行的 action
 * 工作流程：
 * 1. 使用 reducer 计算新状态
 * 2. 更新内存中的状态
 * 3. 通知所有监听者状态发生变化
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/**
 * Toast 的属性类型
 * 排除了 id 属性，因为 id 由系统自动生成
 */
type Toast = Omit<ToasterToast, "id">;

/**
 * 创建并显示一个新的 toast
 * 
 * @param props - toast 的配置属性
 * @returns 一个对象，包含：
 *   - id: toast 的唯一标识
 *   - dismiss: 关闭此 toast 的方法
 *   - update: 更新此 toast 内容的方法
 * 
 * 示例：
 * ```typescript
 * const { dismiss } = toast({ 
 *   title: "成功！",
 *   description: "操作已完成",
 *   action: <Button onClick={dismiss}>撤销</Button>
 * });
 * ```
 */
function toast({ ...props }: Toast) {
  const id = genId();

  // 创建更新当前 toast 的方法
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  // 创建关闭当前 toast 的方法
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // 添加新的 toast 到系统
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * Toast 系统的核心 Hook
 * 
 * @returns 一个对象，包含：
 *   - toasts: 当前所有活动的 toasts
 *   - toast: 创建新 toast 的函数
 *   - dismiss: 关闭指定或所有 toast 的函数
 * 
 * 使用示例：
 * ```typescript
 * function MyComponent() {
 *   const { toast } = useToast();
 * 
 *   const showToast = () => {
 *     toast({
 *       title: "你好！",
 *       description: "这是一个 toast 通知"
 *     });
 *   };
 * 
 *   return <Button onClick={showToast}>显示通知</Button>;
 * }
 * ```
 */
function useToast() {
  // 将全局状态同步到组件的本地状态
  const [state, setState] = React.useState<State>(memoryState);

  // 订阅状态更新
  React.useEffect(() => {
    // 添加状态监听器
    listeners.push(setState);
    
    // 清理函数：组件卸载时移除监听器
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
