import Vue, { ComponentOptions } from 'vue'

export type VueClass<V> = { new (...args: any[]): V & Vue } & typeof Vue

export type DecoratedClass = VueClass<Vue> & {
  // Декораторы свойств, методов и параметров, созданные помощником `createDecorator`,
  // будут помещать в очередь функции, обновляющие параметры компонентов для отложенной обработки.
  // Они будут выполнены непосредственно перед созданием конструктора компонента.
  __decorators__?: ((options: ComponentOptions<Vue>) => void)[]
}
