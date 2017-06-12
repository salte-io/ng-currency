const webpackConfig = require('./webpack.config.js');

webpackConfig.entry.main = '../index.js';

delete webpackConfig.externals;

module.exports = webpackConfig;
