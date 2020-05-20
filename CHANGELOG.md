# [8.0.0-alpha.6](https://github.com/vuejs/vue-class-component/compare/v8.0.0-alpha.5...v8.0.0-alpha.6) (2020-05-20)


### Bug Fixes

* handle ssr render function injection ([830b3b2](https://github.com/vuejs/vue-class-component/commit/830b3b298f819eb1fbbc6f314b51450f2be57e35))
* relax $emit type ([bc0a8bc](https://github.com/vuejs/vue-class-component/commit/bc0a8bcc0777cde837bbe3af2a534d146e934864))



# [8.0.0-alpha.5](https://github.com/vuejs/vue-class-component/compare/v8.0.0-alpha.4...v8.0.0-alpha.5) (2020-05-10)


### Bug Fixes

* handle hot module replacement ([72347b7](https://github.com/vuejs/vue-class-component/commit/72347b7b37b6e0099eaf8c46922ab1f91f061dc5))



# [8.0.0-alpha.4](https://github.com/vuejs/vue-class-component/compare/v8.0.0-alpha.3...v8.0.0-alpha.4) (2020-05-06)


### Build System

* rename dist file names to align vue core lib ([c65712e](https://github.com/vuejs/vue-class-component/commit/c65712eb85f03fab8ddfba622f6262d1c01c8670))


### Features

* add setup helper function to invoke composition functions ([6f1a404](https://github.com/vuejs/vue-class-component/commit/6f1a40449d51e7ec8225e49d0ddfcb6763477915))
* mark as side effect free to enable efficient tree-shaking ([#423](https://github.com/vuejs/vue-class-component/issues/423)) ([70ed762](https://github.com/vuejs/vue-class-component/commit/70ed762449d18c5f9d66a8141ab8691f7bfba5ec))


### BREAKING CHANGES

* file names under `dist/` directory have been changed as following:
  * vue-class-component.js -> vue-class-component.global.js (also changed from umd to iife)
  * vue-class-component.min.js -> vue-class-component.global.prod.js (also changed from umd to iife)
  * vue-class-component.common.js -> vue-class-component.cjs.js
  * vue-class-component.esm.js -> vue-class-component.esm-bundler.js
  * vue-class-component.esm.browser.js -> vue-class-component.esm-browser.js
  * vue-class-component.esm.browser.min.js -> vue-class-component.esm-browser.prod.js



# [8.0.0-alpha.3](https://github.com/vuejs/vue-class-component/compare/v8.0.0-alpha.2...v8.0.0-alpha.3) (2020-04-26)


### Features

* support composition functions in property initializers ([744f6ca](https://github.com/vuejs/vue-class-component/commit/744f6ca0328a02e0a2f5368cf5830ad8922b9e5f))


### BREAKING CHANGES

* remove component name inference from class name



# [8.0.0-alpha.2](https://github.com/vuejs/vue-class-component/compare/v8.0.0-alpha.1...v8.0.0-alpha.2) (2020-04-12)


### Features

* make it work with vue-loader ([5bfebad](https://github.com/vuejs/vue-class-component/commit/5bfebad9af02f81a3076b49e8616c1481dc7cce5))



# [8.0.0-alpha.1](https://github.com/vuejs/vue-class-component/compare/v7.2.3...v8.0.0-alpha.1) (2020-04-12)

---

For changes prior to v8, please see [GitHub release note](https://github.com/vuejs/vue-class-component/releases).