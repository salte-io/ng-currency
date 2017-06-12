const path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    'ng-currency': './ng-currency.module.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    library: 'ng-currency',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: [{
    angular: 'angular'
  }],
  devtool: 'source-map',
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
