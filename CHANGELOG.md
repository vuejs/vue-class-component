# [8.0.0-beta.4](https://github.com/vuejs/vue-class-component/compare/v8.0.0-beta.3...v8.0.0-beta.4) (2020-10-04)


### Breaking Changes

* Reverted `props` and `emits` helper proposed at [#447](https://github.com/vuejs/vue-class-component/issues/447)

### Bug Fixes

* **types:** include undefined type for optional prop definition ([19880a7](https://github.com/vuejs/vue-class-component/commit/19880a72a27d260af1ec14f628f440ff2a2ccd80))
* make decorator accepts any vue constructor types (fix [#457](https://github.com/vuejs/vue-class-component/issues/457)) ([c3ccae0](https://github.com/vuejs/vue-class-component/commit/c3ccae03d795380c615e90fe066c4e1ffb272e15))


### Features

* allow to define `props` by class ([fd96c63](https://github.com/vuejs/vue-class-component/commit/fd96c6323377b287519005594865ed1264602642))
  * You can see the detailed proposal at [#465](https://github.com/vuejs/vue-class-component/issues/465)
* support async setup (fix [#463](https://github.com/vuejs/vue-class-component/issues/463)) ([90336e9](https://github.com/vuejs/vue-class-component/commit/90336e99d4dcaf69f4e8e2743f962f069002f304))



# [8.0.0-beta.3](https://github.com/vuejs/vue-class-component/compare/v8.0.0-beta.2...v8.0.0-beta.3) (2020-09-17)


### Features

* make props type compatible with vue@3.0.0-rc.12 ([39774a8](https://github.com/vuejs/vue-class-component/commit/39774a8b78898b222532787ef4b2c6eab03977ac))

### Breaking Changes

* setup only unwrap shallow refs ([57e16c9](https://github.com/vuejs/vue-class-component/commit/57e16c96939c5eed1e627e6ef2b8e791518d6214))



# [8.0.0-beta.2](https://github.com/vuejs/vue-class-component/compare/v8.0.0-beta.1...v8.0.0-beta.2) (2020-09-14)


### Bug Fixes

* correctly inherit mixin type when used with props and emits helpers ([7c87b03](https://github.com/vuejs/vue-class-component/commit/7c87b0390b629bf521debb892a9789f7e572ca99))
* allow extra props of components in TSX ([7b3029e](https://github.com/vuejs/vue-class-component/commit/7b3029ed458f307a269da4947618fc9bf18d35c3))
* make props with `default` optional in TSX ([ab65f42](https://github.com/vuejs/vue-class-component/commit/ab65f4236042fbc79e485f2d0b601629cbcc1060))



# [8.0.0-beta.1](https://github.com/vuejs/vue-class-component/compare/v8.0.0-alpha.6...v8.0.0-beta.1) (2020-09-12)


### Features

Added `props` and `emits` mixin helpers to define corresponding component options with type safety.
You can see the detailed proposal at [#447](https://github.com/vuejs/vue-class-component/issues/447)


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