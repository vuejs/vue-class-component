module.exports = {
  preset: 'ts-jest/presets/js-with-babel',

  testMatch: [
    '**/test/**/?(*.)+(spec|test).[jt]s?(x)'
  ],

  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.cjs.prod.js'
  },

  globals: {
    'ts-jest': {
      tsConfig: 'test/tsconfig.json',
      babelConfig: 'test/.babelrc'
    }
  }
}
