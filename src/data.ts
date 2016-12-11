import * as Vue from 'vue'
import { VueClass } from './declarations'
import { noop, warn } from './util'

export function collectDataFromConstructor (vm: Vue, Component: VueClass) {
  // override _init to prevent to init as Vue instance
  Component.prototype._init = function (this: Vue) {
    // proxy to actual vm
    Object.getOwnPropertyNames(vm).forEach(key => {
      Object.defineProperty(this, key, {
        get: () => vm[key],
        set: value => vm[key] = value
      })
    })
  }

  // should be acquired class property values
  const data = new Component()

  // create plain data object
  const plainData = {}
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      plainData[key] = data[key]
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
      warn(
        'Component class must inherit Vue or its descendant class ' +
        'when class property is used.'
      )
    }
  }

  return plainData
}
