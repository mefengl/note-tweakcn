/**
 * 手风琴组件
 * 基于 Radix UI 的 Accordion 组件封装
 * 
 * 主要特点：
 * 1. 可折叠的内容面板
 * 2. 支持键盘导航
 * 3. 动画过渡效果
 * 4. 完全可定制的样式
 * 
 * 使用示例：
 * ```tsx
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>这是标题</AccordionTrigger>
 *     <AccordionContent>这是可折叠的内容</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

// 导出基础的 Accordion 根组件
const Accordion = AccordionPrimitive.Root;

/**
 * 手风琴项组件
 * 每个可折叠的部分都包裹在这个组件中
 * 
 * @component
 * @example
 * <AccordionItem value="unique-value">
 *   {/* 子组件 */}
 * </AccordionItem>
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)} // 默认添加底部边框
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

/**
 * 手风琴触发器组件
 * 点击此组件可以展开/收起内容
 * 
 * 特点：
 * 1. 自带下箭头图标
 * 2. 悬停时显示下划线
 * 3. 展开时箭头旋转 180 度
 * 4. 支持键盘操作
 * 
 * @component
 * @example
 * <AccordionTrigger>点击我展开/收起</AccordionTrigger>
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/**
 * 手风琴内容组件
 * 可折叠的内容区域
 * 
 * 特点：
 * 1. 展开/收起时有平滑动画
 * 2. 自动处理溢出内容
 * 3. 支持自定义内边距
 * 
 * @component
 * @example
 * <AccordionContent>
 *   这里是可以折叠的内容
 * </AccordionContent>
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
