module.exports = {
  entry: './example/example.js',
  output: {
    path: './example',
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/src/,
        loader: 'babel?stage=0'
      }
    ]
  },
  devtool: 'source-map'
}
