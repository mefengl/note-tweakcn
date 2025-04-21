/**
 * 编辑器页面的顶部导航栏组件
 * 
 * 这个文件实现了编辑器页面顶部的导航栏，包含网站logo、GitHub链接（显示星标数量）、支持按钮和社交媒体链接。
 * 该组件设计为响应式，在不同屏幕尺寸下有不同的显示效果。
 * 
 * 功能亮点:
 * - 显示网站logo和名称，并链接到首页
 * - 实时显示GitHub上项目的星标数量
 * - 提供支持项目的链接（捐赠按钮）
 * - 提供社交媒体链接（Discord、Twitter）
 * - 响应式设计适配不同屏幕尺寸
 */

"use client";

// 导入必要的库和组件
import Link from "next/link";  // Next.js的链接组件，用于页面间无刷新导航
import { Heart } from "lucide-react";  // 心形图标组件，用于支持按钮
import GitHubIcon from "@/assets/github.svg";  // GitHub图标SVG
import TwitterIcon from "@/assets/twitter.svg";  // Twitter图标SVG
import DiscordIcon from "@/assets/discord.svg";  // Discord图标SVG
import Logo from "@/assets/logo.svg";  // 网站Logo SVG
import { useGithubStars } from "@/hooks/use-github-stars";  // 自定义Hook，用于获取GitHub仓库的星标数
import { SocialLink } from "@/components/social-link";  // 社交媒体链接组件
import { Separator } from "@/components/ui/separator";  // 分隔线组件，用于视觉分离

// 定义并导出Header组件
export function Header() {
  // 使用自定义Hook获取GitHub仓库星标数
  // jnsahaj是用户名，tweakcn是仓库名
  const { stargazersCount } = useGithubStars("jnsahaj", "tweakcn");

  return (
    // 顶部导航栏容器，带有底部边框
    <header className="border-b">
      {/* 内部容器，设置内边距和布局 */}
      <div className="p-4 flex items-center gap-2 justify-between">
        {/* 左侧区域：网站logo和名称 */}
        <div className="flex items-center gap-1">
          {/* 链接到首页 */}
          <Link href="/" className="flex items-center gap-2">
            {/* 网站logo，size-6表示尺寸为1.5rem */}
            <Logo className="size-6" title="tweakcn" />
            {/* 网站名称，在移动设备上隐藏（md:block表示在中等及以上屏幕才显示） */}
            <span className="font-bold hidden md:block">tweakcn</span>
          </Link>
        </div>
        
        {/* 右侧区域：各种社交链接 */}
        <div className="flex items-center gap-3.5">
          {/* GitHub链接及星标数 */}
          <SocialLink
            href="https://github.com/jnsahaj/tweakcn"
            className="flex items-center gap-2 text-sm font-bold"
          >
            <GitHubIcon className="size-4" />
            {/* 只有当星标数大于0时才显示，使用toLocaleString格式化数字（添加千位分隔符） */}
            {stargazersCount > 0 && stargazersCount.toLocaleString()}
          </SocialLink>
          
          {/* 垂直分隔线 */}
          <Separator orientation="vertical" className="h-8" />
          
          {/* 在移动设备上隐藏的部分链接（md:flex表示在中等及以上屏幕才显示） */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* 支持/赞助链接，带有特殊的悬停效果（鼠标悬停时边框和文字变为粉色） */}
            <SocialLink
              href="https://github.com/sponsors/jnsahaj"
              className="flex items-center gap-1.5 px-2 py-1 rounded-md border hover:border-pink-500 hover:text-pink-500 transition-colors"
            >
              <Heart className="size-4" strokeWidth={2.5} />
              <span className="text-sm font-medium">Support</span>
            </SocialLink>
            
            {/* Discord社区链接 */}
            <SocialLink href="https://discord.gg/Phs4u2NM3n">
              <DiscordIcon className="size-5" />
            </SocialLink>
          </div>
          
          {/* Twitter链接（现在是X，但仍使用Twitter图标） */}
          <SocialLink href="https://x.com/iamsahaj_xyz">
            <TwitterIcon className="size-4" />
          </SocialLink>
        </div>
      </div>
    </header>
  );
}
