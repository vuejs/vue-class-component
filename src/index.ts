import * as Vue from 'vue'
import { VueClass } from './declarations'

import { componentFactory } from './component'

export { createDecorator } from './util'

export default function Component <U extends Vue>(options: Vue.ComponentOptions<U>): <V extends VueClass>(target: V) => V
export default function Component <V extends VueClass>(target: V): V
export default function Component <V extends VueClass>(options: Vue.ComponentOptions<any> | V): any {
  if (typeof options === 'function') {
    return componentFactory(options)
  }
  return function (Component: V) {
    return componentFactory(Component, options)
  }
}
