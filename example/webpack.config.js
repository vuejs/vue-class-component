module.exports = {
  entry: './example/example.es7.js',
  output: {
    path: './example',
    filename: 'build.js'
  },
  module: {
    loaders: [
      { test: /\.es7\.js$/, loader: 'babel?stage=0' }
    ]
  },
  devtool: 'source-map'
}
