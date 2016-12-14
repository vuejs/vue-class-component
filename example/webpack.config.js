module.exports = {
  entry: './example/example.ts',
  output: {
    path: './example',
    filename: 'build.js'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.common.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src/,
        loader: 'ts-loader'
      }
    ]
  },
  devtool: 'source-map'
}
