import { PropOptions } from 'vue'
import { createDecorator, VueDecorator } from './util'
import { Constructor } from './prop'

/**
 * decorator of model
 * @param  event event name
 * @return VueDecorator
 */
export function Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {}): VueDecorator {
  return createDecorator((componentOptions, k) => {
    (componentOptions.props || (componentOptions.props = {}) as any)[k] = options
    componentOptions.model = { prop: k, event: event || k }
  })
}
