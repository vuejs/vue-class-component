module.exports = {
  entry: './test/test.js',
  output: {
    path: './test',
    filename: 'build.js'
  },
  module: {
    loaders: [
      { test: /\.es$/, loader: 'babel?stage=0' }
    ]
  }
}
