/**
 * Public APIs
 */

export { Vue, ClassComponentHooks } from './vue'

export { Options, createDecorator, mixins, setup } from './helpers'

export { prop } from './props'

/**
 * Other types
 */

export {
  VueBase,
  VueMixin,
  VueStatic,
  VueConstructor,
  EmitsOptions,
  ObjectEmitsOptions,
  PublicProps,
} from './vue'

export {
  PropOptions,
  PropOptionsWithDefault,
  PropOptionsWithRequired,
  WithDefault,
  VueWithProps,
  DefaultFactory,
  DefaultKeys,
  ExtractDefaultProps,
  ExtractProps,
} from './props'

export {
  VueDecorator,
  MixedVueBase,
  UnionToIntersection,
  ExtractInstance,
  UnwrapSetupValue,
} from './helpers'
