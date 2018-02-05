import Vue, { PropOptions, WatchOptions } from 'vue'
import { createDecorator, VueDecorator } from './util'

/**
 * decorator of an inject
 * @param key key
 * @return VueDecorator
 */
export function Inject(key?: string | symbol) {
  return createDecorator((componentOptions, k) => {
    if (typeof componentOptions.inject === 'undefined') {
      componentOptions.inject = {}
    }
    if (!Array.isArray(componentOptions.inject)) {
      componentOptions.inject[k] = key || k
    }
  })
}
