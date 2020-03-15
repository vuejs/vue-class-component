module.exports = {
  sourceMaps: true,
  presets: ['@babel/env', '@babel/typescript'],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-class-properties', { loose: true }]
  ]
}
