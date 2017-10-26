import Vue, { ComponentOptions } from 'vue'

export type VueClass<V extends Vue> = { new (...args: any[]): V } & typeof Vue

export type DecoratedClass = VueClass<Vue> & {
  // Property, method and parameter decorators created by `createDecorator` helper
  // will enqueue functions that update component options for lazy processing.
  // They will be executed just before creating component constructor.
  __decorators__?: ((options: ComponentOptions<any, any, any, any>) => void)[]
}
