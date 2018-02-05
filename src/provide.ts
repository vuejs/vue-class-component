import Vue, { PropOptions, WatchOptions } from 'vue'
import { createDecorator, VueDecorator } from './util'

/**
 * decorator of a provide
 * @param key key
 * @return VueDecorator
 */
export function Provide(key?: string | symbol) {
  return createDecorator((componentOptions, k) => {
    let provide: any = componentOptions.provide

    if (typeof provide !== 'function' || !provide.managed) {
      const original = componentOptions.provide

      provide = componentOptions.provide = function (this: Vue) {
        const returnValue = createReturnValue(this, original)

        for (let i in provide.managed) {
          returnValue[provide.managed[i]] = this[i]
        }

        return returnValue
      }

      provide.managed = {}
    }

    provide.managed[k] = key || k
  })
}

function createReturnValue(self: Vue, original?: object | (() => object)) {
  const obj = typeof original === 'function' ? original.call(self) : original
  return Object.create(obj || null)
}
