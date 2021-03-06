module.exports = {
  output: {
    pathinfo: true
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules\/(?!chai)/,
      loader: 'babel-loader'
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'html-loader'
    }]
  },
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false
  }
};
