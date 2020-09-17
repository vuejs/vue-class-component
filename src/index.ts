/**
 * Public APIs
 */

export { Vue, ClassComponentHooks } from './vue'

export {
  Options,
  createDecorator,
  mixins,
  props,
  emits,
  setup,
} from './helpers'

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
  VueDecorator,
  MixedVueBase,
  UnionToIntersection,
  ExtractInstance,
  NarrowEmit,
} from './helpers'
