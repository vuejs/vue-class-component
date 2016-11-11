import * as Vue from 'vue'
import { VueClass } from './declarations'
import { noop } from './util'

export function collectDataFromConstructor (vm: Vue, Component: VueClass) {
  // Create dummy Vue instance to collect
  // initial class properties from the component constructor.
  // To prevent to print warning,
  // the data object should inherit Vue.prototype.
  const data = Object.create(Component.prototype, {
    _init: {
      get: () => noop
    }
  })

  // proxy to each prop values
  const propKeys = Object.keys(vm.$options.props || {})
  propKeys.forEach(key => {
    Object.defineProperty(data, key, {
      get: () => vm[key]
    })
  })

  // call constructor with passing dummy instance
  // `data` object will have initial data
  Component.call(data)

  // create plain data object
  const plainData = {}
  Object.keys(data).forEach(key => {
    plainData[key] = data[key]
  })

  return plainData
}