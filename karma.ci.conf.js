const webpackConfig = require('./webpack.test.config.js');

module.exports = function(config) {
  const karmaConfig = {
    basePath: '',

    frameworks: [
      'jasmine',
      'sinon'
    ],

    files: [
      'test/index.js'
    ],

    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    reporters: ['spec'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    browsers: [
      'Chrome',
      'Firefox'
    ],

    captureTimeout: 0,
    browserNoActivityTimeout: 120000,

    singleRun: true
  };

  config.set(karmaConfig);
};
