import Vue, { ComponentOptions } from 'vue'

export type VueClass<V> = { new (...args: any[]): V & Vue } & typeof Vue

export type DecoratedClass = VueClass<Vue> & {
  // Property, method and parameter decorators created by `createDecorator` helper
  // will enqueue functions that update component options for lazy processing.
  // They will be executed just before creating component constructor.
  __decorators__?: ((options: ComponentOptions<Vue>) => void)[]
}
