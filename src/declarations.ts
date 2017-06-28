import Vue from 'vue'

export type VueClass = { new (): Vue } & typeof Vue

export type DecoratedClass = VueClass & {
  // Property, method and parameter decorators created by `createDecorator` helper
  // will enqueue functions that update component options for lazy processing.
  // They will be executed just before creating component constructor.
  __decorators__?: ((options: Vue.ComponentOptions<Vue>) => void)[]
}
