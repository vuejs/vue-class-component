import * as Vue from 'vue'
import { VueClass } from './declarations'
import { componentFactory, $internalHooks } from './component'

export { createDecorator } from './util'

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
    $internalHooks.push(...keys)
  }
}

export default Component