module.exports = {
  entry: './example/example.ts',
  output: {
    path: './example',
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src/,
        loader: 'ts'
      }
    ]
  },
  devtool: 'source-map'
}
