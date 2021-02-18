const isEnvDev = process.env.NODE_ENV === 'development';

module.exports = {
  title: '测试',
  globalConstants: {
    'process.env.NODE_ENV': JSON.stringify(isEnvDev ? 'development' : 'production'),
  },
};
