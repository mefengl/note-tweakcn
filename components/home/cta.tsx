/**
 * 主页行动召唤（Call to Action）组件
 * 
 * 这是网站主页的重要转化区域，用于引导用户尝试产品或访问 GitHub。
 * 
 * 视觉特点：
 * 1. 渐变背景 + 网格图案
 * 2. 动态模糊光晕效果
 * 3. 入场动画
 * 4. 悬停效果
 */

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
      {/* 背景网格装饰 */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* 左上角动态光晕 */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      
      {/* 右下角动态光晕（延迟1.5秒） */}
      <div
        className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <div className="container px-4 md:px-6 relative">
        {/* 内容容器 - 使用 Framer Motion 实现入场动画 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}     // 初始状态：透明且向下偏移
          whileInView={{ opacity: 1, y: 0 }}  // 进入视口时：完全显示且回到原位
          transition={{ duration: 0.5 }}       // 动画持续0.5秒
          className="flex flex-col items-center justify-center space-y-6 text-center"
        >
          {/* 标题 */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}  // 动画只播放一次
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            Ready to Make Your Components Stand Out?
          </motion.h2>

          {/* 说明文本 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}  // 延迟0.1秒开始动画
            className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl"
          >
            Start customizing your shadcn/ui components today and create a unique
            look for your application.
          </motion.p>

          {/* 按钮组 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}  // 延迟0.2秒开始动画
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            {/* "立即尝试"按钮 */}
            <Link href="/editor/theme">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full h-12 px-8 text-base cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
              >
                Try It Now
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>

            {/* GitHub 按钮 */}
            <Link href="https://github.com/jnsahaj/tweakcn">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full bg-transparent h-12 px-8 text-base transition-all duration-300 hover:translate-y-[-2px]"
              >
                View on GitHub
              </Button>
            </Link>
          </motion.div>

          {/* 底部说明文本 */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}  // 延迟0.3秒开始动画
            className="text-sm text-primary-foreground/80 mt-4"
          >
            No login required. Free to use. Open source.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
