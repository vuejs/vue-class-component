import * as Vue from 'vue'

const internalHooks = [
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

type VueClass = { new (): Vue } & typeof Vue

function componentFactory (
  Component: VueClass & { _componentTag: string }, 
  options: Vue.ComponentOptions<any> = {}
): VueClass {
  options.name = options.name || Component._componentTag
  // prototype props.
  const proto = Component.prototype
  Object.getOwnPropertyNames(proto).forEach(function (key) {
    if (key === 'constructor') {
      return
    }
    // hooks
    if (internalHooks.indexOf(key) > -1) {
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
  // find super
  const superProto = Object.getPrototypeOf(Component.prototype)
  const Super: VueClass = superProto instanceof Vue
    ? superProto.constructor as VueClass
    : Vue
  return Super.extend(options)
}


export default function decorator (options: Vue.ComponentOptions<any>): ClassDecorator
export default function decorator <TFunction extends Function>(target: TFunction): void | TFunction
export default function decorator (options: any): any {
  if (typeof options === 'function') {
    return componentFactory(options)
  }
  return function (Component: any) {
    return componentFactory(Component, options)
  }
}

