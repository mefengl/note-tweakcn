// 导入 Node.js 的 'path' 模块，这个模块可以帮助我们处理文件和目录的路径。
// 就像你需要知道去某个地方的具体路线一样，程序也需要知道文件的准确位置。
import path from "path";

/**
 * @type {import('next').NextConfig}
 * 这是一个 JSDoc 注释，它告诉 TypeScript 这个变量 `nextConfig` 的类型是什么。
 * `import('next').NextConfig` 表示这个对象的结构应该符合 Next.js 框架定义的配置规范。
 * 这有助于代码编辑器的智能提示和类型检查，就像给代码加了个说明书，告诉我们怎么正确使用它。
 */
const nextConfig = {
  // `webpack` 是一个非常流行的 JavaScript 模块打包工具。
  // Next.js 底层使用 Webpack 来处理项目中的代码、图片、CSS 等资源，并将它们打包成浏览器可以理解的格式。
  // 这个 `webpack` 字段允许我们自定义 Next.js 的 Webpack 配置，对其进行扩展或修改。
  // 就好比我们买了一辆车（Next.js），但我们想给它加装一些特殊的配件（自定义 Webpack 配置）。
  webpack: (config: any) => {
    // `config` 参数是 Next.js 默认的 Webpack 配置对象。我们可以在这个函数里修改它。
    // 'any' 类型表示我们暂时不指定这个 config 对象的具体类型，灵活性更高，但牺牲了一些类型安全。

    // --- SVG 文件处理配置 ---
    // SVG (Scalable Vector Graphics) 是一种基于 XML 的矢量图像格式。它可以无限放大而不失真。
    // 在 Web 开发中，我们有时希望直接把 SVG 当作图片 URL 使用 (例如在 `<img>` 标签的 src 里)，
    // 有时则希望把它当作一个 React 组件来使用，这样可以方便地通过 props 控制 SVG 的颜色、大小等。
    // Next.js 默认可能只提供一种处理方式，或者处理方式不符合我们的需求，所以这里需要自定义。

    // 1. 找到 Next.js 默认处理文件的规则中，用于处理 `.svg` 文件的那条规则。
    // Webpack 配置由一系列规则 (rules) 组成，每条规则告诉 Webpack 如何处理特定类型的文件。
    // `config.module.rules` 是一个包含这些规则的数组。
    // `find` 方法用来遍历这个数组，找到第一个 `test` 属性（一个正则表达式）能够匹配 ".svg" 的规则。
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg")
    );

    // 2. 添加新的规则来处理 SVG 文件。
    config.module.rules.push(
      // 2.1. 针对以 `?url` 结尾的 SVG 导入 (`import logo from './logo.svg?url';`)
      // 这条规则告诉 Webpack：如果导入的 SVG 文件路径后面带有 `?url` 查询参数，
      // 那么就继续使用之前找到的 `fileLoaderRule` (通常是 `file-loader` 或类似加载器) 来处理它。
      // `...fileLoaderRule` 是展开语法，表示复制 `fileLoaderRule` 的所有属性。
      // `test: /\.svg$/i` 表示这条规则只适用于 `.svg` 文件 (i 表示不区分大小写)。
      // `resourceQuery: /url/` 表示只匹配那些资源路径后面带有 `?url` 的导入。
      // 结果：这种导入会得到一个 SVG 文件的 URL 字符串。
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // 2.2. 针对所有其他的 SVG 导入 (`import Logo from './logo.svg';`)
      // 这条规则处理所有不带 `?url` 查询参数的 `.svg` 文件导入。
      // `test: /\.svg$/i` 同样表示只适用于 `.svg` 文件。
      // `issuer` 通常用来指定导入这个文件的源文件的类型，这里沿用旧规则的 issuer。
      // `resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }` 表示不匹配带有 `?url` 的导入。
      // `use` 指定了处理这些 SVG 文件所使用的加载器 (loader)。
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: [
          {
            // `@svgr/webpack` 是一个 Webpack 加载器，能将 SVG 文件转换成 React 组件。
            // 这样我们就可以像使用普通 React 组件一样使用 SVG 了：`<Logo color="red" />`
            loader: "@svgr/webpack",
            options: {
              // `dimensions: false` 表示转换后的组件默认不包含 width 和 height 属性，
              // 这样更容易通过 CSS 或父组件来控制大小。
              dimensions: false,
              // `titleProp: true` 表示允许通过 `title` prop 给 SVG 添加一个 `<title>` 元素，
              // 这有助于提高可访问性 (Accessibility)。
              titleProp: true,
            },
          },
        ],
      }
    );

    // 3. 修改原始的 `fileLoaderRule`，让它不再处理任何 `.svg` 文件。
    // 因为我们上面已经通过两条新规则完全接管了 SVG 的处理方式。
    // `exclude` 属性告诉这条规则要忽略哪些文件。
    fileLoaderRule.exclude = /\.svg$/i;

    // --- 路径别名配置 ---
    // 配置路径别名可以让我们在导入模块时使用更短、更易记的路径，而不需要写很长的相对路径 (`../../components/Button`)。
    // `config.resolve.alias` 就是用来配置这些别名的。
    config.resolve.alias = {
      // `...config.resolve.alias` 保留 Next.js 可能已经配置的其他别名。
      ...config.resolve.alias,
      // 将 `@` 符号映射到项目的根目录 (`.`)。
      // 这样我们就可以用 `import Button from '@/components/ui/button'` 来代替 `import Button from './components/ui/button'`。
      // 这让代码更整洁，也方便文件移动。
      "@": ".",
    };

    // --- 特定库版本或实现的覆盖 ---
    // 有时候，我们可能因为某些原因（比如某个库的特定版本有 bug，或者想用自己的实现替换掉某个依赖）
    // 需要强制 Webpack 在解析某个模块时使用我们指定的文件。
    // 这里是将 `@radix-ui/react-use-effect-event` 这个模块的导入指向了我们项目内部的 `stubs/use-effect-event.js` 文件。
    // `path.resolve(__dirname, "stubs/use-effect-event.js")` 会生成这个 stub 文件的绝对路径。
    // `__dirname` 是 Node.js 中的一个变量，表示当前文件所在的目录的绝对路径。
    // 这可能是为了解决 Radix UI 某个版本与 React 19 不兼容的问题，或者项目有特殊的实现需求。
    config.resolve.alias["@radix-ui/react-use-effect-event"] = path.resolve(
      __dirname,
      "stubs/use-effect-event.js"
    );

    // 最后，必须返回修改后的 `config` 对象，Webpack 才会使用我们的自定义配置。
    return config;
  },
};

// 导出 `nextConfig` 对象，供 Next.js 框架使用。
export default nextConfig;
