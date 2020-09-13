const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: './src/main.ts',
  output: {
    path: __dirname,
    filename: 'build.js',
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm-bundler.js',
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              appendTsxSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              babelParserPlugins: [
                'jsx',
                'classProperties',
                'decorators-legacy',
              ],
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [new VueLoaderPlugin()],
}
