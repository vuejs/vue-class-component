module.exports = {
  entry: './example/example.ts',
  output: {
    path: __dirname,
    filename: 'build.js'
  },
  resolve: {
    extensions: ['.ts', '.js','tsx']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules|vue\/src/,
        loader:[
          {
            loader: "babel-loader"
          },
          {
            loader: "ts-loader",
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true
        }
      }
    ]
  },
  devtool: 'source-map'
}
