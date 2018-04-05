import { PropOptions } from 'vue'
import { createDecorator, VueDecorator } from './util'

export type Constructor = {
  new(...args: any[]): any
}

/**
 * decorator against a prop
 * @param  options the options for the prop
 * @return VueDecorator
 */
export function Prop(options: (PropOptions | Constructor[] | Constructor) = {}): VueDecorator {
  return createDecorator((componentOptions, k) => {
    (componentOptions.props || (componentOptions.props = {}) as any)[k] = options
  })
}
