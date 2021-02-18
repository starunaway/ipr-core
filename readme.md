# 文档

## webpack.config

_*一些需要注意的地方*_

1. 配置文件不在根目录下，使用 `path.resolve` 的时候需要定位到指定目录

1. `config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx']`
   在编译过程中会有 `js` 文件产生，不能只写 `ts`
1. `babel-loader` 需要 `exclude` `node_modules`,否则会处理 `node_modules`下的文件，`break some code`

## packge.json

```javascript
{
  //  程序入口
  // main 是commonJS模块 ，module 是 ES Module，
  // 被用户使用后，require() 或 import的时候 优先使用 module 的路径
  "main": "lib/index.js",
  "module": "es/index.js",
  // 指定ts的typing文件，方便用户使用的时候显示类型
  "typings": "index.d.ts",
  // 指定内部命令对应的可执行文件
  "bin": {
    "YOUR-SHELL-SCRIPT": "./bin/someTool.js"
  }
}
```

## [tsconfig 配置选项](https://www.tslang.cn/docs/handbook/tsconfig-json.html)

```javascript
{
  // IDE在保存文件的时候根据tsconfig.json重新生成文件，自动编译
  "compileOnSave": true,
  "compilerOptions": {
    // 允许编译javascript文件。如果需要js ts 混用，打开
    "allowJs": false,
    // 允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。
    "allowSyntheticDefaultImports": true,
    // 不报告执行不到的代码错误（如果代码有错误，不管用不用到都报错。true 关闭提醒）
    "allowUnreachableCode": false,
    // 不报告未使用的标签错误。（如果标签未使用，报错 true 关闭提醒）
    "allowUnusedLabels": false,
    // 以严格模式解析并为每个源文件生成 "use strict"语句
    "alwaysStrict": false,
    // 解析非相对模块名的基准目录。
    "baseUrl": ".",
    // 输入文件的字符集。
    "charset": "utf8",
    // 在 .js文件中报告错误。allowJs需要为true。
    "checkJs": false,
    //生成相应的 .d.ts文件。(一般自己做，不要自动生成)
    "declaration": false,
    // 生成声明文件的输出路径
    // "declarationDir":'',
    // 显示诊断信息。
    "diagnostics": false,
    // 禁用JavaScript工程体积大小的限制
    "disableSizeLimit": false,
    // 在输出文件的开头加入BOM头（UTF-8 Byte Order Mark）。
    "emitBOM": false,
    //显示详细的诊段信息。
    "extendedDiagnostics": false,
    // 禁止对同一个文件的不一致的引用
    "forceConsistentCasingInFileNames": false,
    // 从 tslib 导入辅助工具函数（比如 __extends， __rest等）
    // "importHelpers":'',
    // 生成单个sourcemaps文件，而不是将每sourcemaps生成不同的文件。
    "inlineSourceMap": false,
    // 将代码与sourcemaps生成到一个文件中，要求同时设置了 inlineSourceMap或 sourceMap属性。
    "inlineSources": false,
    // 将每个文件作为单独的模块（与“ts.transpileModule”类似）。
    "isolatedModules": false,
    // 在 .tsx文件里支持JSX： "React"或 "Preserve"
    "jsx": "Preserve",
    // 指定生成目标为react JSX时，使用的JSX工厂函数，比如 React.createElement或 h。
    "jsxFactory": "React.createElement",
    // 编译过程中需要引入的库文件的列表
    // ► ES5► ES6► ES2015► ES7► ES2016► ES2017► ES2018► ESNext► DOM► DOM.Iterable► WebWorker► ScriptHost► ES2015.Core► ES2015.Collection► ES2015.Generator
    // ► ES2015.Iterable► ES2015.Promise► ES2015.Proxy► ES2015.Reflect► ES2015.Symbol► ES2015.Symbol.WellKnown► ES2016.Array.Include► ES2017.object
    // ► ES2017.Intl► ES2017.SharedMemory► ES2017.String► ES2017.TypedArrays► ES2018.Intl► ES2018.Promise► ES2018.RegExp► ESNext.AsyncIterable► ESNext.Array
    // ► ESNext.Intl► ESNext.Symbol

    "lib": ["DOM", "ES5", "ScriptHost"],
    //打印出编译后生成文件的名字。
    "listEmittedFiles": false,
    //编译过程中打印文件名
    "listFiles": false,
    // 显示错误信息时使用的语言,和系统有关，一般不用设置
    "locale": "en-us",
    // sourcemap文件的路径，而不是使用生成时的路径。。指定的路径会嵌入到 sourceMap里告诉调试器到哪里去找它们。
    // "mapRoot":'',
    // node_modules依赖的最大搜索深度并加载JavaScript文件。 allowJs 开启时才有效
    "maxNodeModuleJsDepth": 0,

    // 指定生成哪个模块系统代码 "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或 "ES2015"
    // target为ES5 或更低时，"ES6"或 "ES2015" 有效
    "module": "commonjs",
    // 决定如何处理模块。浏览器环境默认Classic
    "moduleResolution": "Classic",
    // 当生成文件时指定行结束符 "crlf"（windows）或 "lf"（unix）。
    "newLine": "crlf",
    // 不生成输出文件。
    "noEmit": false,
    // 不在输出文件中生成用户自定义的帮助函数代码，
    "noEmitHelpers": false,
    // 报错时不生成输出文件。
    "noEmitOnError": false,
    // 不截短错误消息。
    "noErrorTruncation": false,
    // 报告switch语句的fallthrough错误; 为true 多个case禁止并排写
    "noFallthroughCasesInSwitch": false,
    // 在表达式和声明上有隐含的 any类型时报错。为true ，禁用any 赶紧关了
    "noImplicitAny": false,
    // 不是函数的所有返回路径都有返回值时报错。 为true ，函数必须有返回值
    "noImplicitReturns": false,
    // 当 this表达式的值为 any类型的时候，生成一个错误。
    "noImplicitThis": false,
    // 模块输出中不包含 "use strict"指令。
    "noImplicitUseStrict": false,
    // 不包含默认的库文件（ lib.d.ts）
    "noLib": false,
    // 不把 /// <reference``>或模块导入的文件加到编译文件列表。
    "noResolve": false,
    // 禁用在函数类型里对泛型签名进行严格检查。
    "noStrictGenericChecks": false,
    // 若有未使用的局部变量则抛错
    "noUnusedLocals": false,
    // 若有未使用的参数则抛错
    "noUnusedParameters": false,
    // 重定向输出目录
    "outDir": "",
    // 将输出文件合并为一个文件。合并的顺序是根据传入编译器的文件顺序和 ///<reference``>和 import的文件顺序决定的。
    "outFile": "",
    // 模块名到基于 baseUrl的路径映射的列表 webpack配置别名后，需要同步添加解析
    "paths": {},
    // 保留 const和 enum声明
    "preserveConstEnums": false,
    // 不把符号链接解析为其真实路径；将符号链接文件视为真正的文件。
    "preserveSymlinks": false,
    // 保留watch模式下过时的控制台输出
    "preserveWatchOutput": false,
    // 编译指定目录下的项目。这个目录应该包含一个 tsconfig.json文件来管理编译 ,命令行参数
    // "project": "",
    // 删除所有注释，除了以 /!*开头的版权信息
    "removeComments": false,
    // 仅用来控制输出的目录结构 --outDir
    "rootDir": "",
    // 忽略 库的默认声明文件的类型检查。
    "skipDefaultLibCheck": false,
    // 忽略所有的声明文件（ *.d.ts）的类型检查
    "skipLibCheck": false,
    // 生成相应的 .map文件。
    "sourceMap": false,
    // 指定TypeScript源文件的路径，以便调试器定位。当TypeScript文件的位置是在运行时指定时使用此标记。
    "sourceRoot": "",
    // 启用所有严格类型检查选项。相当于启用 --noImplicitAny, --noImplicitThis, --alwaysStrict， --strictNullChecks和 --strictFunctionTypes和
    // --strictPropertyInitialization
    "strict": false,
    // 禁用函数参数双向协变检查
    "strictFunctionTypes": false,
    // 确保类的非undefined属性已经在构造函数里初始化。若要令此选项生效，需要同时启用--strictNullChecks
    "strictPropertyInitialization": false,
    // 在严格的 null检查模式下， null和 undefined值不包含在任何类型里，只允许用它们自己和 any来赋值（有个例外， undefined可以赋值到 void）
    "strictNullChecks": false,
    // 不对具有 /** @internal */ JSDoc注解的代码生成代码
    "stripInternal ": false,
    // 阻止对对象字面量的额外属性检查
    "suppressExcessPropertyErrors ": false,
    // 阻止 --noImplicitAny对缺少索引签名的索引对象报错
    "suppressImplicitAnyIndexErrors": false,
    // 指定ECMAScript目标版本 "ES3"（默认）， "ES5"， "ES6"/ "ES2015"， "ES2016"， "ES2017"或 "ESNext"。
    "target": "ESNext",
    // 生成模块解析日志信息
    "traceResolution": false,
    // 要包含的类型声明文件名列表
    "types": [""],
    // 要包含的类型声明文件路径列表
    // 默认所有可见的"@types"包会在编译过程中被包含进来。如果指定了typeRoots，只有typeRoots下面的包才会被包含进来。 如果需要自定types，需要手动配置node_modules
    // "types": []来禁用自动引入@types包。
    // 建议手动配置，避免总是 type报错
    "typeRoots": [""],
    // 编译器版本号
    "version": "",
    // 在监视模式下运行编译器。
    "watch": false
  },

  // 包含相对或绝对文件路径的列表。明确指定的一定会包含，不能被exclude。outDir目录下的文件如果在files里面，也会包含
  "files": [],
  // include和exclude 匹配模式列表
  "include": ["src/**/*"],
  //  exclude 默认包含node_modules。如果是 a import b ，b被exclude，b不会被包含(b是间接includes)
  "exclude": ["node_modules", "dist"],
  "compileOnSave": false
}
```
