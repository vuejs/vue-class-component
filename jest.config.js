const isBabel = !!process.env.BABEL_TEST

const tsJestConfig = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: 'test/tsconfig.json',
    },
  },
}

const babelJestConfig = {
  transform: {
    '^.+\\.[t|j]sx?$': ['babel-jest', { configFile: './test/babel.config.js' }],
  },
}

module.exports = {
  ...(isBabel ? babelJestConfig : tsJestConfig),

  testMatch: ['**/test/**/?(*.)+(spec|test).[jt]s?(x)'],

  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.cjs.prod.js',
  },
}
