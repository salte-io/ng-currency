const webpackConfig = require('./webpack.test.config.js');
webpackConfig.module.rules.push({
  enforce: 'pre',
  test: /\.js$/,
  exclude: /tests|node_modules/,
  use: {
    loader: 'istanbul-instrumenter-loader',
    options: { esModules: true }
  }
});

module.exports = function(config) {
  config.set({
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
      noInfo: true,
      stats: 'errors-only'
    },

    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'text' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: [
      'ChromeHeadlessNoSandbox'
    ],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    browserNoActivityTimeout: 120000,

    singleRun: false
  });
};
