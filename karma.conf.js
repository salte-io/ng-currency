const webpackConfig = require('./webpack.test.config.js');

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
      'test/index.js': ['webpack', 'sourcemap'],
      'src/**/*.js': ['coverage']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
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

    browsers: ['PhantomJS'],

    captureTimeout: 60000,
    browserDisconnectTimeout: 7000,
    browserDisconnectTolerance: 1,
    browserDisconnectNoActivityTimeout: 60000,

    singleRun: false
  });
};
