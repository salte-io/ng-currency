const webpackConfig = require('./webpack.test.config.js');

module.exports = function(config) {
  const customLaunchers = {
    ChromeBeta: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'beta'
    },
    Chrome: {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    Firefox: {
      base: 'SauceLabs',
      browserName: 'firefox'
    },
    Edge: {
      base: 'SauceLabs',
      browserName: 'microsoftedge'
    },
    InternetExplorer11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11'
    },
    InternetExplorer10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10'
    },
    // TODO: Enable this once https://github.com/karma-runner/karma/issues/3198 is resolved
    // Safari10: {
    //   base: 'SauceLabs',
    //   browserName: 'safari',
    //   version: '10'
    // },
    Safari9: {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '9'
    },
    Safari8: {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '8'
    }
  };

  const karmaConfig = {
    basePath: '',

    frameworks: [
      'mocha',
      'sinon',
      'polyfill'
    ],

    polyfill: [
      'Promise',
      'fetch',
      'URL'
    ],

    files: [
      'tests/index.js'
    ],

    preprocessors: {
      'tests/index.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only'
    },

    reporters: ['mocha', 'saucelabs'],

    mochaReporter: {
      output: 'minimal',
      showDiff: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    sauceLabs: {
      testName: 'salte-io/ng-currency',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: true
    },

    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    captureTimeout: 0,
    browserNoActivityTimeout: 120000,

    singleRun: true
  };

  config.set(karmaConfig);
};
