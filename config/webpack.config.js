const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const devConfig = require('./webpack.dev.config');
const prdConfig = require('./webpack.prd.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const projectConfig = require('./project.config');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');

const isEnvDev = process.env.NODE_ENV === 'development';
const isEnvPrd = process.env.NODE_ENV === 'production';

const hasJsxRuntime = (() => {
  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

console.log('__dirname', __dirname, path.resolve(__dirname, '../src'));
const baseConfig = {
  entry: path.resolve(__dirname, '../src'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `static/js/[name].[hash:8].js`,
    //  配置按需加载时外部资源的路径（可能放到其他目录下，在代码中引用的时候需要注意）
    publicPath: '/',
  },
  resolve: {
    //  在编译过程中会有js文件产生，不能只写ts
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      // 如果有些包直接使用cdn接入，需要配置别名防止出错
      //   react: resolve(node_modules, 'react'),
      //   history: resolve(node_modules, 'history'),
      //   redux: resolve(node_modules, 'redux'),
      //   'react-dom': resolve(node_modules, 'react-dom'),
      //   'react-router-dom': resolve(node_modules, 'react-router-dom'),
      //   'react-redux': resolve(node_modules, 'react-redux'),
      '@': path.resolve(__dirname, '../src'),
    },
    plugins: [
      //快速查找路径，防止漏掉某些依赖；代码写的好，没必要加
      PnpWebpackPlugin,
    ],
  },
  resolveLoader: {
    plugins: [
      //  优先从本地加载loader
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },

  // 如果有些包直接使用cdn接入，不需要打包到bundle中
  externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
    // 'react-router-dom': 'ReactRouterDOM',
    // redux: 'Redux',
    // 'react-redux': 'ReactRedux',
    // 'redux-saga': 'ReduxSaga',
    // history: 'History',
    // echarts: 'echarts',
  },
  module: {
    rules: [
      {
        //  当规则匹配时，只使用第一个规则
        oneOf: [
          {
            //  图片
            test: /\.(bmp|png|jpe?g|gif)$/,
            enforce: 'pre',
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/images/[name].[hash:8].[ext]',
            },
          },
          {
            // js
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve('babel-preset-react-app/webpack-overrides'),
              exclude: /node_modules/,
              presets: [
                [
                  require.resolve('babel-preset-react-app'),
                  {
                    runtime: hasJsxRuntime ? 'automatic' : 'classic',
                  },
                ],
              ],

              plugins: [
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                      },
                    },
                  },
                ],
                isEnvDev && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              // See #6846 for context on why cacheCompression is disabled
              cacheCompression: false,
              compact: isEnvPrd,
            },
          },
          {
            //   处理样式文件
            test: /\.(less|css)$/,
            enforce: 'pre',
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [require('autoprefixer'), require('cssnano'), require('postcss-normalize')()],
                },
              },
              'less-loader',
            ],
          },
          {
            //  字体
            test: /\.(ttf|svg|eot|woff)$/,
            enforce: 'pre',
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/fonts/[name].[hash:8].[ext]',
            },
          },

          {
            // 杂七杂八的统一处理一下
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: path.resolve(__dirname, '../public/index.html'),
          title: projectConfig.title,
        },
        isEnvPrd
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined
      )
    ),

    // 在打包后的index.html注入全局变量
    new webpack.DefinePlugin(projectConfig.globalConstants),

    new webpack.LoaderOptionsPlugin({
      minimize: !isEnvDev,
    }),
    new webpack.HashedModuleIdsPlugin(),

    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // TypeScript type checking
    new ForkTsCheckerWebpackPlugin({
      async: isEnvDev,
      checkSyntacticErrors: true,
      tsconfig: path.resolve(__dirname, '../tsconfig.json'),
      reportFiles: [
        // This one is specifically to match during CI tests,
        // as micromatch doesn't match
        // '../cra-template-typescript/template/src/App.tsx'
        // otherwise.
        '../**/src/**/*.{ts,tsx}',
        '**/src/**/*.{ts,tsx}',
        '!**/src/**/__tests__/**',
        '!**/src/**/?(*.)(spec|test).*',
        '!**/src/setupProxy.*',
        '!**/src/setupTests.*',
      ],
      silent: true,
      // The formatter is invoked directly in WebpackDevServerUtils during development
      formatter: isEnvPrd ? typescriptFormatter : undefined,
    }),

    //  把文件直接移动到指定目录下
    new CopyWebpackPlugin([
      //   {
      //     from: resolve(root, 'src/style/'),
      //     to: resolve(outputPath, `${asset}fonts`),
      //     ignore: ['*.less', '*.js'],
      //   },
      //   {
      //     from: resolve(__dirname, 'favicon.ico'),
      //     to: resolve(outputPath, asset),
      //   },
      //   {
      //     from: resolve(process.cwd(), 'conf'),
      //     to: resolve(outputPath, 'conf'),
      //   },
    ]),
  ].filter(Boolean),
  // 在第一个错误出现时抛出失败结果，而不是容忍它
  bail: isEnvPrd,
};

module.exports = () => {
  const config = isEnvDev ? devConfig : prdConfig;
  return merge(baseConfig, config);
};
