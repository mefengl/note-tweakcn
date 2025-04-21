/**
 * 示例卡片展示组件集合
 * 
 * 这个文件包含了各种UI卡片的展示组件，用于展示主题系统的能力。
 * 所有的卡片都被组织成一个响应式的两列布局。
 * 
 * 特点：
 * 1. 使用 @container 查询实现局部响应式布局
 * 2. 卡片之间保持统一的间距和对齐
 * 3. 在大屏幕上展示两列，小屏幕上展示单列
 */

import { cn } from "@/lib/utils";
import { DemoCookieSettings } from "./cards/cookie-settings";
import { DemoCreateAccount } from "./cards/create-account";
import { DemoDatePicker } from "./cards/date-picker";
import { DemoGithub } from "./cards/github-card";
import { DemoNotifications } from "./cards/notifications";
import { DemoPaymentMethod } from "./cards/payment-method";
import { DemoReportAnIssue } from "./cards/report-an-issue";
import { DemoShareDocument } from "./cards/share-document";
import { DemoTeamMembers } from "./cards/team-members";
import { DemoStats } from "./cards/stats";
import { DemoChat } from "./cards/chat";
import { DemoFontShowcase } from "./cards/font-showcase";

/**
 * 示例容器组件
 * 用于统一包装和布局每个演示卡片
 * 
 * @component
 * @param {Object} props - 组件属性
 * @param {string} [props.className] - 自定义CSS类名
 * 
 * 特点：
 * 1. 居中对齐内容
 * 2. 确保子元素占满容器宽度
 * 3. 支持自定义类名扩展样式
 */
export function DemoContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-center [&>div]:w-full", className)}
      {...props}
    />
  );
}

/**
 * 示例卡片集合组件
 * 展示各种UI卡片的主组件
 * 
 * 布局策略：
 * 1. 使用 @container 查询实现容器查询布局
 * 2. 在大屏幕（@4xl）上使用两列布局
 * 3. 在小屏幕上使用单列布局
 * 4. 所有卡片之间保持4个单位的间距(gap-4)
 * 
 * @component
 * @example
 * ```tsx
 * <DemoCards />
 * ```
 */
function DemoCards() {
  return (
    <div className="@container">
      <div className="flex flex-col @4xl:flex-row items-center @4xl:items-start justify-center gap-4">
        {/* 第一列：统计、创建账户、Github、Cookie设置、团队成员和字体展示 */}
        <div className="flex flex-col gap-4 max-w-lg">
          <DemoContainer>
            <DemoStats />
          </DemoContainer>
          <DemoContainer>
            <DemoCreateAccount />
          </DemoContainer>
          <DemoContainer>
            <DemoGithub />
          </DemoContainer>
          <DemoContainer>
            <DemoCookieSettings />
          </DemoContainer>
          <DemoContainer>
            <DemoTeamMembers />
          </DemoContainer>
          <DemoContainer>
            <DemoFontShowcase />
          </DemoContainer>
        </div>

        {/* 第二列：问题报告、支付方式、文档共享、通知、聊天和日期选择器 */}
        <div className="flex flex-col gap-4 max-w-lg">
          <DemoContainer>
            <DemoReportAnIssue />
          </DemoContainer>
          <DemoContainer>
            <DemoPaymentMethod />
          </DemoContainer>
          <DemoContainer>
            <DemoShareDocument />
          </DemoContainer>
          <DemoContainer>
            <DemoNotifications />
          </DemoContainer>
          <DemoContainer>
            <DemoChat />
          </DemoContainer>
          <DemoContainer>
            <DemoDatePicker />
          </DemoContainer>
        </div>
      </div>
    </div>
  );
}

export default DemoCards;
