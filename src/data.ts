import Vue from 'vue'
import { VueClass } from './declarations'
import { noop, warn } from './util'

function deepReplace(source: any, from: any, to: any, done: WeakSet<any> = new WeakSet) {
	if(from === source) return to;
	if(!source || 'object'!== typeof source || done.has(source))
		return source;
	done.add(source)
	for(let i in source) source[i] = deepReplace(source[i], from, to, done);
	return source;
}

export function collectDataFromConstructor (vm: Vue, Component: VueClass) {
  // override _init to prevent to init as Vue instance
  Component.prototype._init = function (this: Vue) {
    // proxy to actual vm
    const keys = Object.getOwnPropertyNames(vm)
    // 2.2.0 compat (props are no longer exposed as self properties)
    if (vm.$options.props) {
      for (const key in vm.$options.props) {
        if (!vm.hasOwnProperty(key)) {
          keys.push(key)
        }
      }
    }
    keys.forEach(key => {
      if (key.charAt(0) !== '_') {
        Object.defineProperty(this, key, {
          get: () => vm[key],
          set: value => vm[key] = value
        })
      }
    })
  }

  // should be acquired class property values
  const data = new Component()

  // create plain data object
  const plainData = {}
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      plainData[key] = deepReplace(data[key], data, vm)
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
