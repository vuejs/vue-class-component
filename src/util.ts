import Vue, { ComponentOptions } from 'vue'
import { VueClass, DecoratedClass } from './declarations'

export const noop = () => {}

const fakeArray = { __proto__: [] }
export const hasProto = fakeArray instanceof Array

export interface VueDecorator {
  // Class decorator
  (Ctor: typeof Vue): void

  // Property decorator
  (target: Vue, key: string): void

  // Parameter decorator
  (target: Vue, key: string, index: number): void
}

export function createDecorator (factory: (options: ComponentOptions<Vue>, key: string, index: number) => void): VueDecorator {
  return (target: Vue | typeof Vue, key?: any, index?: any) => {
    const Ctor = typeof target === 'function'
      ? target as DecoratedClass
      : target.constructor as DecoratedClass
    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = []
    }
    if (typeof index !== 'number') {
      index = undefined
    }
    Ctor.__decorators__.push(options => factory(options, key, index))
  }
}

export type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never

export type ExtractInstance<T> = T extends VueClass<infer V> ? V : never

export type MixedVueClass<
  Mixins extends VueClass<Vue>[]
> = Mixins extends (infer T)[]
  ? VueClass<UnionToIntersection<ExtractInstance<T>>>
  : never

export function mixins<T extends VueClass<Vue>[]>(...Ctors: T): MixedVueClass<T>
export function mixins (...Ctors: VueClass<Vue>[]): VueClass<Vue> {
  return Vue.extend({ mixins: Ctors })
}

export function isPrimitive (value: any): boolean {
  const type = typeof value
  return value == null || (type !== 'object' && type !== 'function')
}

export function warn (message: string): void {
  if (typeof console !== 'undefined') {
    console.warn('[vue-class-component] ' + message)
  }
}
