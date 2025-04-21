/**
 * CSS导入对话框组件
 * 
 * 这个组件是一个弹出式对话框，让用户可以导入自定义的CSS代码到主题编辑器中。
 * 
 * 想象一下，如果我们把网站的样式比作房子的装修，这个组件就像一个允许你把自己已经
 * 设计好的装修方案导入进来的工具。用户可以把他们自己写好的CSS样式代码粘贴到对话框中，
 * 然后导入到编辑器中使用。
 * 
 * 功能包括：
 * 1. 提供文本输入区域让用户粘贴CSS代码
 * 2. 对输入的CSS进行基本验证，确保它包含必要的变量定义
 * 3. 显示错误信息（如果CSS格式有问题）
 * 4. 导入成功时关闭对话框并清空输入框
 * 
 * CSS变量是以"--"开头的特殊标记，比如"--primary: #FF0000"表示主色是红色。
 * 这些变量会被应用到整个网站的主题中。
 */
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * 组件属性接口定义
 * 
 * 这个接口描述了这个组件需要接收的三个属性：
 * - open: 控制对话框是否显示
 * - onOpenChange: 当对话框开关状态变化时的回调函数
 * - onImport: 当用户点击导入按钮时的回调函数，会把CSS文本传递出去
 */
interface CssImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (css: string) => void;
}

const CssImportDialog: React.FC<CssImportDialogProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  // 用于存储用户输入的CSS文本
  const [cssText, setCssText] = useState("");
  // 用于存储验证过程中可能出现的错误信息
  const [error, setError] = useState<string | null>(null);

  /**
   * 处理导入按钮点击的函数
   * 
   * 这个函数会：
   * 1. 检查用户是否输入了内容
   * 2. 检查输入的内容是否看起来像CSS变量（包含"--"和":"）
   * 3. 如果验证通过，则调用onImport函数并关闭对话框
   * 4. 如果验证失败，则显示错误信息
   */
  const handleImport = () => {
    // 基础验证 - 检查CSS内容是否为空
    if (!cssText.trim()) {
      setError("Please enter CSS content");
      return;
    }

    try {
      // 这里可以添加更复杂的CSS解析验证
      // 现在只做一个简单的检查
      if (!cssText.includes("--") || !cssText.includes(":")) {
        setError(
          "Invalid CSS format. CSS should contain variable definitions like --primary: #color"
        );
        return;
      }

      // 验证通过，调用导入函数并清理状态
      onImport(cssText);
      setCssText("");
      setError(null);
      onOpenChange(false);
    } catch {
      setError("Failed to parse CSS. Please check your syntax.");
    }
  };

  /**
   * 处理关闭对话框的函数
   * 
   * 当用户点击取消按钮或者关闭对话框时，
   * 清空输入框和错误信息，然后关闭对话框
   */
  const handleClose = () => {
    setCssText("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        {/* 对话框标题和描述 */}
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Import Custom CSS
          </DialogTitle>
          <DialogDescription>
            Paste your CSS file below to customize the theme colors. Make sure
            to include variables like --primary, --background, etc.
          </DialogDescription>
        </DialogHeader>

        {/* 如果有错误，显示错误提示 */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* CSS输入区域 */}
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder={`:root {
  --background: 0 0% 100%;
  --foreground: oklch(0.52 0.13 144.17);
  --primary: #3e2723;
  /* And more */
}
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: hsl(37.50 36.36% 95.69%);
  --primary: rgb(46, 125, 50);
  /* And more */
}
  `}
            className="min-h-[300px] font-mono text-sm text-foreground"
            value={cssText}
            onChange={(e) => {
              setCssText(e.target.value);
              // 当用户开始输入时，清除错误提示
              if (error) setError(null);
            }}
          />
        </div>
        
        {/* 底部按钮区域 */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-foreground"
          >
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CssImportDialog;
