const path = require('path');
const webpack = require('webpack');
const deindent = require('deindent');
const packageJson = require('./package.json');
const { argv: args } = require('yargs');

const isProd = args.mode === 'production';

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    'ng-currency': ['./ng-currency.module.js']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: isProd ? '[name].min.js' : '[name].js',
    sourceMapFilename: '[file].map',
    library: 'ng-currency',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'angular': 'angular'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  optimization: {
    minimize: isProd ? true : false
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: deindent(`
        /**
         * ${packageJson.name} JavaScript Library v${packageJson.version}
         *
         * @license MIT (${packageJson.homepage}/blob/master/LICENSE)
         *
         * Made with ♥ by ${packageJson.contributors.join(', ')}
         */
      `).trim(),
      raw: true
    })
  ]
};
