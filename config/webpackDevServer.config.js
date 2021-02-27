const ignoredFiles = require('react-dev-utils/ignoredFiles');
const paths = require('./paths');
const path = require('path');

const host = process.env.HOST || '0.0.0.0';

module.exports = function (allowedHost) {
  return {
    disableHostCheck: false,
    // 开启 gzip
    compress: true,
    // 关闭WDS的日志。但是warning和error还在
    clientLogLevel: 'none',

    contentBase: path.resolve(__dirname, '../public'),
    contentBasePublicPath: '/',
    // 模板文件变动，也reload
    watchContentBase: true,
    hot: true,
    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    transportMode: 'ws',
    // Prevent a WS client from getting injected as we're already including
    // `webpackHotDevClient`.
    injectClient: false,

    // It is important to tell WebpackDevServer to use the same "publicPath" path as
    // we specified in the webpack config. When homepage is '.', default to serving
    // from the root.
    // remove last slash so user can land on `/test` instead of `/test/`
    publicPath: paths.publicUrlOrPath.slice(0, -1),
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
    quiet: true,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebook/create-react-app/issues/293
    // src/node_modules is not ignored to support absolute imports
    // https://github.com/facebook/create-react-app/issues/1065
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc),
    },
    host,
    overlay: false,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    public: allowedHost,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  };
};
