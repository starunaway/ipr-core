const path = require('path');

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// config after eject: we're in ./config/
module.exports = {
  appPath: path.resolve(__dirname, '../'),
  appBuild: path.resolve(__dirname, '../dist'),
  appPublic: path.resolve(__dirname, '../public'),
  appHtml: path.resolve(__dirname, '../public/index.html'),
  appIndexJs: path.resolve(__dirname, '../src/index.tsx'),
  appPackageJson: path.resolve(__dirname, '../package.json'),
  appSrc: path.resolve(__dirname, '../src'),
  appTsConfig: path.resolve(__dirname, '../tsconfig.json'),
  proxySetup: path.resolve(__dirname, '../src/setupProxy.js'),
  appNodeModules: path.resolve(__dirname, '../node_modules'),
  swSrc: path.resolve(__dirname, '../src/service-worker.ts'),
  publicUrlOrPath: '/',
};

module.exports.moduleFileExtensions = moduleFileExtensions;
