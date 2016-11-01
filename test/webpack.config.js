module.exports = {
  entry: './test/test.ts',
  output: {
    path: './test',
    filename: 'test.build.js'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src/,
        loader: 'ts'
      }
    ]
  }
}
