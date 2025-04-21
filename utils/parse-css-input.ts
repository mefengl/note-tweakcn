/**
 * CSS输入解析工具
 * 
 * 这个文件的作用是读取和理解用户输入的CSS代码，并把它转换成程序可以使用的数据。
 * 
 * 想象一下，如果CSS代码是一种特殊的语言，这个工具就像一个翻译官，
 * 它能把这种语言翻译成我们的程序能理解的"话"。
 * 
 * 主要功能：
 * 1. 从CSS文本中提取出变量定义（以"--"开头的部分）
 * 2. 区分明亮模式(:root)和暗黑模式(.dark)的变量
 * 3. 将提取的变量转换为标准格式，并保存到对象中
 * 4. 处理不同格式的颜色值（如HSL, RGB, HEX等）
 */
import { ThemeStyleProps } from "@/types/theme";
import { colorFormatter } from "./color-converter";
import { COMMON_STYLES, defaultThemeState } from "@/config/theme";

// 从默认主题状态中获取所有有效的变量名
export const variableNames = Object.keys(defaultThemeState.styles.light);
// 不是颜色的变量列表（如字体、圆角等）
const nonColorVariables = COMMON_STYLES;
// CSS变量的前缀
const VARIABLE_PREFIX = "--";

/**
 * 解析CSS输入文本
 * 
 * 这个函数就像是阅读一本食谱，然后把里面的材料和步骤提取出来。
 * 它会分析用户输入的CSS代码，找出其中的颜色变量，并分别存储
 * 明亮模式和暗黑模式的颜色设置。
 * 
 * @param input 用户输入的CSS文本
 * @returns 包含明亮模式和暗黑模式颜色设置的对象
 */
export const parseCssInput = (input: string) => {
  // 准备两个空对象来存储提取的颜色变量
  const lightColors: ThemeStyleProps = {} as ThemeStyleProps;
  const darkColors: ThemeStyleProps = {} as ThemeStyleProps;

  try {
    // 提取:root（明亮模式）的CSS块内容
    const rootContent = extractCssBlockContent(input, ":root");
    // 提取.dark（暗黑模式）的CSS块内容
    const darkContent = extractCssBlockContent(input, ".dark");

    // 如果找到了:root内容，解析其中的变量
    if (rootContent) {
      parseColorVariables(rootContent, lightColors, variableNames);
    }
    // 如果找到了.dark内容，解析其中的变量
    if (darkContent) {
      parseColorVariables(darkContent, darkColors, variableNames);
    }
  } catch (error) {
    console.error("Error parsing CSS input:", error);
  }

  // 返回解析结果
  return { lightColors, darkColors };
};

/**
 * 提取CSS块内容
 * 
 * 这个函数就像在一本大书中寻找特定的章节。
 * 它会在CSS文本中找到指定选择器（如:root或.dark）的内容块。
 * 
 * 例如，从下面的CSS中：
 * :root { --color: red; }
 * .dark { --color: blue; }
 * 
 * 如果selector是":root"，它会返回"--color: red;"
 * 
 * @param input 完整的CSS文本
 * @param selector 要查找的选择器（如:root或.dark）
 * @returns 选择器内的CSS内容，如果没找到则返回null
 */
const extractCssBlockContent = (
  input: string,
  selector: string
): string | null => {
  // 创建一个正则表达式来匹配选择器及其花括号内的内容
  const regex = new RegExp(`${escapeRegExp(selector)}\\s*{([^}]+)}`);
  // 使用正则表达式匹配内容并返回第一个捕获组（括号内的内容）
  return input.match(regex)?.[1]?.trim() || null;
};

/**
 * 解析颜色变量
 * 
 * 这个函数就像是把食谱中的每种食材分别放入不同的盒子里。
 * 它会解析CSS内容中的所有变量定义，并将它们存储到目标对象中。
 * 
 * 例如从"--primary: #ff0000;"中，它会提取出
 * primary作为键名，#ff0000作为值，存入目标对象。
 * 
 * @param cssContent CSS内容文本
 * @param target 存储解析结果的目标对象
 * @param validNames 有效变量名列表
 */
const parseColorVariables = (
  cssContent: string,
  target: ThemeStyleProps,
  validNames: string[]
) => {
  // 使用正则表达式匹配所有变量声明（格式为--变量名: 值）
  const variableDeclarations = cssContent.match(/--[^:]+:\s*[^;]+/g) || [];

  // 处理每一个变量声明
  variableDeclarations.forEach((declaration) => {
    // 分割变量名和值
    const [name, value] = declaration.split(":").map((part) => part.trim());
    // 去掉变量名前面的"--"前缀
    const cleanName = name.replace(VARIABLE_PREFIX, "");

    // 检查是否是有效的变量名
    if (validNames.includes(cleanName)) {
      // 如果是非颜色变量（如字体、圆角等），直接保存值
      if (nonColorVariables.includes(cleanName)) {
        target[cleanName as keyof ThemeStyleProps] = value;
        return;
      }

      // 处理颜色值（转换格式）并保存
      const colorValue = processColorValue(value);
      const formattedValue = colorFormatter(colorValue, "hex");
      target[cleanName as keyof ThemeStyleProps] = formattedValue;
    }
  });
};

/**
 * 处理颜色值
 * 
 * 这个函数就像是识别不同种类的颜色表示方式，然后把它们转换成统一的格式。
 * 
 * 例如，有时颜色是这样写的："0 0% 100%"（HSL值），
 * 它会把这种格式转换为："hsl(0 0% 100%)"，让其他函数更容易处理。
 * 
 * @param value 原始颜色值
 * @returns 处理后的颜色值
 */
const processColorValue = (value: string): string => {
  // 如果值以数字开头，假设它是HSL值，加上"hsl()"前缀
  return /^\d/.test(value) ? `hsl(${value})` : value;
};

/**
 * 转义正则表达式特殊字符
 * 
 * 这个辅助函数确保特殊字符在正则表达式中被正确处理。
 * 想象成给魔法文字加上保护罩，这样它们就不会被误解。
 * 
 * 例如，"."在正则表达式中表示"任意字符"，但如果我们想真的匹配句点，
 * 就需要将其转义为"\\."。这个函数自动完成这个工作。
 * 
 * @param string 需要转义的字符串
 * @returns 转义后的字符串
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
