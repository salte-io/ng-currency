module.exports = {
  output: {
    pathinfo: true
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      include: /test/,
      loader: 'eslint-loader'
    }, {
      enforce: 'pre',
      test: /\.js$/,
      exclude: /test|node_modules/,
      loader: 'isparta-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'html-loader'
    }]
  },
  devtool: 'inline-source-map'
};
