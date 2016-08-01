module.exports = {
  output: {
    pathinfo: true
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      include: /test/,
      loader: 'eslint'
    }, {
      test: /\.js$/,
      exclude: /test|node_modules/,
      loader: 'isparta'
    }],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'html'
    }]
  },
  devtool: 'inline-source-map'
};
