const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
  ],

  devServer: {
    contentBase: path.resolve(process.cwd(), 'dist'),
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
