import * as Vue from 'vue'
import { VueClass } from './declarations'
import { componentFactory, $internalHooks } from './component'

export { createDecorator } from './util'

export interface ComponentDecorator {
  <U extends Vue>(options: Vue.ComponentOptions<U>): <V extends VueClass>(target: V) => V
  <V extends VueClass>(target: V): V

  registerHooks (key: string[]): void
}

const Component: ComponentDecorator = function <V extends VueClass>(
  options: Vue.ComponentOptions<any> | V
): any {
  if (typeof options === 'function') {
    return componentFactory(options)
  }
  return function (Component: V) {
    return componentFactory(Component, options)
  }
} as any

Component.registerHooks = function (keys) {
  $internalHooks.push(...keys)
}

export default Component