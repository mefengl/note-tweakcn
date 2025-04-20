// 导入获取编辑器配置的函数
import { getEditorConfig } from "@/config/editors";
// 导入 cn 工具函数，用于合并 Tailwind CSS 类名
import { cn } from "@/lib/utils";
// 导入编辑器主组件
import Editor from "@/components/editor/editor";
// 导入 Next.js 的 Metadata 类型，用于定义页面元数据
import { Metadata } from "next";
// 导入编辑器页面的 Header 组件
import { Header } from "../../../components/editor/header";

// 定义并导出页面的元数据对象
export const metadata: Metadata = {
  // 页面标题
  title: "tweakcn — Theme Generator for shadcn/ui",
  // 页面描述，通常用于 SEO
  description:
    "Easily customize and preview your shadcn/ui theme with tweakcn. Modify colors, fonts, and styles in real-time.",
};

// 定义并导出主题编辑器页面组件
export default function Component() {
  // 返回页面的 JSX 结构
  return (
    // 使用 React Fragment (<>) 包裹多个顶级元素
    <>
      {/* 最外层的 div，设置高度为屏幕高度、flex 纵向布局、文字和背景颜色，以及颜色过渡效果 */}
      <div
        className={cn(
          "h-screen flex flex-col text-foreground bg-background transition-colors"
        )}
      >
        {/* 渲染编辑器页面的 Header 组件 */}
        <Header />
        {/* 主要内容区域，flex-1 使其占据剩余空间，overflow-hidden 防止内容溢出 */}
        <main className="flex-1 overflow-hidden">
          {/* 
            渲染 Editor 组件 
            传入从 getEditorConfig 获取的特定于 'theme' 的配置 
            这个配置可能包含了编辑器需要展示的控件、处理逻辑等信息
          */}
          <Editor config={getEditorConfig("theme")} />
        </main>
      </div>
    </>
  );
}
