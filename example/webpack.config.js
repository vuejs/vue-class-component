module.exports = {
  entry: './example/example.es',
  output: {
    path: './example',
    filename: 'build.js'
  },
  module: {
    loaders: [
      { test: /\.es$/, loader: 'babel?stage=0' }
    ]
  }
}
