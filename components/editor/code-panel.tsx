/**
 * Code Panel Component
 * 
 * This component is responsible for displaying the generated theme CSS code based on the current
 * theme editor state. It provides options to copy the code to clipboard and select different
 * color formats and Tailwind versions.
 * 
 * Key features:
 * - Displays generated CSS theme code
 * - Allows copying code to clipboard
 * - Provides registry command for installing the theme with Shadcn
 * - Supports different color formats (HSL, OKLCH, RGB, HEX)
 * - Supports different Tailwind versions (v3 and v4)
 * - Configurable package manager (pnpm, npm, yarn, bun)
 * - Tracks user actions using PostHog analytics
 * 
 * The component adapts to the selected theme preset and shows a special command
 * for registry-based installation when a non-default preset is selected.
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { ThemeEditorState } from "@/types/editor";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ColorFormat } from "../../types";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { usePostHog } from "posthog-js/react";
import { useEditorStore } from "@/store/editor-store";
import { usePreferencesStore } from "@/store/preferences-store";
import { generateThemeCode } from "@/utils/theme-style-generator";

/**
 * Props for the CodePanel component
 * 
 * @interface CodePanelProps
 * @property {ThemeEditorState} themeEditorState - The current state of the theme editor
 */
interface CodePanelProps {
  themeEditorState: ThemeEditorState;
}

/**
 * CodePanel component for displaying and copying theme CSS code
 * 
 * @param {CodePanelProps} props - Component props
 * @returns {JSX.Element} - The rendered component
 */
const CodePanel: React.FC<CodePanelProps> = ({ themeEditorState }) => {
  // State for tracking if copy buttons have been clicked
  const [registryCopied, setRegistryCopied] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Initialize PostHog for analytics tracking
  const posthog = usePostHog();

  // Get values and setters from global stores
  const preset = useEditorStore((state) => state.themeState.preset);
  const colorFormat = usePreferencesStore((state) => state.colorFormat);
  const tailwindVersion = usePreferencesStore((state) => state.tailwindVersion);
  const packageManager = usePreferencesStore((state) => state.packageManager);
  const setColorFormat = usePreferencesStore((state) => state.setColorFormat);
  const setTailwindVersion = usePreferencesStore(
    (state) => state.setTailwindVersion
  );
  const setPackageManager = usePreferencesStore(
    (state) => state.setPackageManager
  );

  // Generate the actual theme CSS code based on current settings
  const code = generateThemeCode(
    themeEditorState,
    colorFormat,
    tailwindVersion
  );

  /**
   * Generates the appropriate shell command for installing the theme via Shadcn registry
   * based on the selected package manager
   * 
   * @param {string} preset - The theme preset name
   * @returns {string} - The shell command to install the theme
   */
  const getRegistryCommand = (preset: string) => {
    const url = `https://tweakcn.com/r/themes/${preset}.json`;
    switch (packageManager) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add ${url}`;
      case "npm":
        return `npx shadcn@latest add ${url}`;
      case "yarn":
        return `yarn dlx shadcn@latest add ${url}`;
      case "bun":
        return `bunx shadcn@latest add ${url}`;
    }
  };

  /**
   * Copies the registry command to the clipboard and shows a success indicator
   */
  const copyRegistryCommand = async () => {
    try {
      await navigator.clipboard.writeText(
        getRegistryCommand(preset ?? "default")
      );
      setRegistryCopied(true);
      setTimeout(() => setRegistryCopied(false), 2000); // Reset after 2 seconds
      captureCopyEvent("COPY_REGISTRY_COMMAND");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  /**
   * Tracks copy events in PostHog analytics
   * 
   * @param {string} event - The event name to track
   */
  const captureCopyEvent = (event: string) => {
    posthog.capture(event, {
      editorType: "theme",
      preset,
      colorFormat,
      tailwindVersion,
    });
  };

  /**
   * Copies the provided text to clipboard and shows a success indicator
   * 
   * @param {string} text - The text to copy to clipboard
   */
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      captureCopyEvent("COPY_CODE");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header section with title */}
      <div className="flex-none mb-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Theme Code</h2>
        </div>
        
        {/* Registry command section - only shown for non-default presets */}
        {preset && preset !== "default" && (
          <div className="mt-4 rounded-md overflow-hidden border">
            {/* Package manager selection buttons */}
            <div className="flex border-b">
              {(["pnpm", "npm", "yarn", "bun"] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPackageManager(pm)}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    packageManager === pm
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pm}
                </button>
              ))}

              {/* Copy registry command button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={copyRegistryCommand}
                className="h-8 ml-auto"
                aria-label={
                  registryCopied ? "Copied to clipboard" : "Copy to clipboard"
                }
              >
                {registryCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
            
            {/* Registry command display with horizontal scrolling */}
            <div className="p-2 bg-muted/50 flex justify-between items-center">
              <ScrollArea className="w-full">
                <div className="whitespace-nowrap overflow-y-hidden pb-2">
                  <code className="text-sm font-mono">
                    {getRegistryCommand(preset)}
                  </code>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
      
      {/* Tailwind version and color format selector section */}
      <div className="flex items-center gap-2 mb-4 ">
        {/* Tailwind version selector */}
        <Select
          value={tailwindVersion}
          onValueChange={(value: "3" | "4") => {
            setTailwindVersion(value);
            // If switching to Tailwind v4, also switch from HSL to OKLCH which is preferred in v4
            if (value === "4" && colorFormat === "hsl") {
              setColorFormat("oklch");
            }
          }}
        >
          <SelectTrigger className="w-fit focus:ring-transparent focus:border-none bg-muted/50 outline-hidden border-none gap-1">
            <SelectValue className="focus:ring-transparent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Tailwind v3</SelectItem>
            <SelectItem value="4">Tailwind v4</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Color format selector */}
        <Select
          value={colorFormat}
          onValueChange={(value: ColorFormat) => setColorFormat(value)}
        >
          <SelectTrigger className="w-fit focus:ring-transparent focus:border-none bg-muted/50 outline-hidden border-none gap-1">
            <SelectValue className="focus:ring-transparent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hsl">hsl</SelectItem>
            <SelectItem value="oklch">oklch</SelectItem>
            <SelectItem value="rgb">rgb</SelectItem>
            <SelectItem value="hex">hex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Code display area */}
      <div className="flex-1 min-h-0 flex flex-col rounded-lg border overflow-hidden">
        {/* Code header with filename and copy button */}
        <div className="flex-none flex justify-between items-center px-4 py-2 border-b bg-muted/50">
          <span className="text-sm font-medium">index.css</span>

          <div className="flex items-center gap-2">
            {/* Copy code button with dynamic text/icon */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(code)}
              className="h-8"
              aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  <span className="sr-only md:not-sr-only">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span className="sr-only md:not-sr-only">Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Scrollable code display area */}
        <ScrollArea className="flex-1 relative">
          <pre className="h-full p-4 text-sm">
            <code>{code}</code>
          </pre>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CodePanel;
