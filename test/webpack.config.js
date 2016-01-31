module.exports = {
  entry: './test/test.js',
  output: {
    path: './test',
    filename: 'test.build.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/src/,
        loader: 'babel?stage=0'
      }
    ]
  }
}
