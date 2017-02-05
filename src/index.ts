import * as Vue from 'vue'
import { VueClass } from './declarations'
import { componentFactory } from './component'
import { Meta } from './meta'

export { createDecorator } from './meta'

function Component <U extends Vue>(options: Vue.ComponentOptions<U>): <V extends VueClass>(target: V) => V
function Component <V extends VueClass>(target: V): V
function Component <V extends VueClass, U extends Vue>(
  options: Vue.ComponentOptions<U> | V
): any {
  if (typeof options === 'function') {
    return componentFactory(options)
  }
  return function (Component: V) {
    return componentFactory(Component, options)
  }
}

namespace Component {
  export function registerHooks (keys: string[]): void {
    Meta.internalHooks.push(...keys)
  }
}

export default Component