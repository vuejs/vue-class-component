import * as Vue from 'vue'
import { VueClass, VueInternal } from './declarations'
import { collectDataFromConstructor } from './data'
import { noop, forEachValues } from './util'
import { Meta } from './meta'

export function componentFactory (
  Component: VueClass,
  options: Vue.ComponentOptions<any> = {}
): VueClass {
  // prototype props.
  const proto = (Component.prototype as VueInternal)

  // Get meta data and remove from prototype
  const meta = proto.__vue_component_meta__
  proto.__vue_component_meta__ = undefined

  options.name = options.name || (Component as any)._componentTag

  Object.getOwnPropertyNames(proto).forEach(function (key) {
    if (key === 'constructor') {
      return
    }
    // hooks
    if (Meta.internalHooks.indexOf(key) > -1) {
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
      return collectDataFromConstructor(this, Component, meta)
    }
  })

  // decorate options
  if (meta) {
    applyDecorators(options, Component, meta)
  }

  // find super
  const superProto = Object.getPrototypeOf(Component.prototype)
  const Super = superProto instanceof Vue
    ? superProto.constructor as VueClass
    : Vue
  return Super.extend(options)
}

function applyDecorators (
  options: Vue.ComponentOptions<Vue>,
  Component: VueClass,
  meta: Meta
): void {
  if (!meta.shouldGetInitalProperty) {
    forEachValues(meta.decoratorMap, fn => {
      fn(options)
    })
    return
  }

  // Prevent to run _init function of Vue
  // because we just want to get initial properties.
  Component.prototype._init = noop
  const data = new Component()

  forEachValues(meta.decoratorMap, (fn, key) => {
    fn(options, meta.propertyNameMap[key] && data[key])
  })
}