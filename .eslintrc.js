module.exports = {
  root: true,
  extends: ['plugin:vue-libs/recommended'],
  parserOptions: {
    parser: 'typescript-eslint-parser'
  },
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off'
  }
}