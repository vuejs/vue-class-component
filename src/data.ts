import * as Vue from 'vue'
import { VueClass } from './declarations'

const noop = () => {}

export function collectDataFromConstructor (vm: Vue, Component: VueClass) {
  // Create dummy Vue instance to collect
  // initial class properties from the component constructor.
  // To prevent to print warning,
  // the data object should inherit Vue.prototype.
  const data = Object.create(vm, {
    _init: {
      get: () => noop
    }
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