import Vue, { ComponentOptions } from 'vue'
import { VueClass } from './declarations'
import { componentFactory, $internalHooks } from './component'

export { createDecorator, VueDecorator, mixins } from './util'

export { Emit } from './emit'
export { Inject } from './inject'
export { Model } from './model'
export { Constructor, Prop } from './prop'
export { Provide } from './provide'
export { Watch } from './watch'

function Component <V extends Vue>(options: ComponentOptions<V> & ThisType<V>): <VC extends VueClass<V>>(target: VC) => VC
function Component <VC extends VueClass<Vue>>(target: VC): VC
function Component (options: ComponentOptions<Vue> | VueClass<Vue>): any {
  if (typeof options === 'function') {
    return componentFactory(options)
  }
  return function (Component: VueClass<Vue>) {
    return componentFactory(Component, options)
  }
}

namespace Component {
  export function registerHooks (keys: string[]): void {
    $internalHooks.push(...keys)
  }
}

export default Component
