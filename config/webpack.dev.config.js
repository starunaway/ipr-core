const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
// const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),

    // new ReactRefreshWebpackPlugin({
    //   overlay: {
    //     entry: webpackDevClientEntry,
    //     // The expected exports are slightly different from what the overlay exports,
    //     // so an interop is included here to enable feedback on module-level errors.
    //     module: reactRefreshOverlayEntry,
    //     // Since we ship a custom dev client and overlay integration,
    //     // the bundled socket handling logic can be eliminated.
    //     // sockIntegration: false,
    //   },
    // }),
  ],

  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    compress: true,
    port: 10086,
    hot: true,
    open: true,
    https: false,

    historyApiFallback: true,
    // 不显示启动服务器时的日志
    clientLogLevel: 'none',
    // 除了基本启动信息，其他的都不显示
    quiet: true,
  },
};
