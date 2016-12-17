import * as Vue from 'vue'
import { VueClass } from './declarations'
import { collectDataFromConstructor } from './data'

export const $internalHooks = [
  'data',
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeDestroy',
  'destroyed',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'render'
]

// Property, method and parameter decorators created by `createDecorator` helper
// will enqueue functions that update component options for lazy processing.
// They will be executed just before creating component constructor.
export let $decoratorQueue: ((options: Vue.ComponentOptions<Vue>) => void)[] = []

export function componentFactory (
  Component: VueClass,
  options: Vue.ComponentOptions<any> = {}
): VueClass {
  options.name = options.name || (Component as any)._componentTag
  // prototype props.
  const proto = Component.prototype
  Object.getOwnPropertyNames(proto).forEach(function (key) {
    if (key === 'constructor') {
      return
    }
    // hooks
    if ($internalHooks.indexOf(key) > -1) {
      options[key] = proto[key]
      return
    }
    const descriptor = Object.getOwnPropertyDescriptor(proto, key)
    if (typeof descriptor.value === 'function') {
      // methods
      (options.methods || (options.methods = {}))[key] = descriptor.value
    } else if (descriptor.get || descriptor.set) {
      // computed properties
      (options.computed || (options.computed = {}))[key] = {
        get: descriptor.get,
        set: descriptor.set
      }
    }
  })

  // add data hook to collect class properties as Vue instance's data
  ;(options.mixins || (options.mixins = [])).push({
    data (this: Vue) {
      return collectDataFromConstructor(this, Component)
    }
  })

  // decorate options
  $decoratorQueue.forEach(fn => fn(options))
  // reset for other component decoration
  $decoratorQueue = []

  // find super
  const superProto = Object.getPrototypeOf(Component.prototype)
  const Super = superProto instanceof Vue
    ? superProto.constructor as VueClass
    : Vue
  return Super.extend(options)
}
