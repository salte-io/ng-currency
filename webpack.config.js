const path = require('path');
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
  }
};
