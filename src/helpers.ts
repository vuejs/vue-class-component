import { ComponentOptions, ShallowUnwrapRef, Ref } from 'vue'

import { Vue, VueBase, VueConstructor, VueMixin } from './vue'

export function Options<V extends Vue>(
  options: ComponentOptions & ThisType<V>
): <VC extends VueConstructor<VueBase>>(target: VC) => VC {
  return (Component) => {
    Component.__o = options
    return Component
  }
}

export interface VueDecorator {
  // Class decorator
  (Ctor: VueConstructor<VueBase>): void

  // Property decorator
  (target: VueBase, key: string): void

  // Parameter decorator
  (target: VueBase, key: string, index: number): void
}

export function createDecorator(
  factory: (options: ComponentOptions, key: string, index: number) => void
): VueDecorator {
  return (
    target: VueBase | VueConstructor<VueBase>,
    key?: any,
    index?: any
  ) => {
    const Ctor =
      typeof target === 'function'
        ? target
        : (target.constructor as VueConstructor)
    if (!Ctor.__d) {
      Ctor.__d = []
    }
    if (typeof index !== 'number') {
      index = undefined
    }
    Ctor.__d.push((options) => factory(options, key, index))
  }
}

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export type ExtractInstance<T> = T extends VueMixin<infer V> ? V : never

export type MixedVueBase<Mixins extends VueMixin[]> = Mixins extends (infer T)[]
  ? VueConstructor<UnionToIntersection<ExtractInstance<T>> & Vue>
  : never

export function mixins<T extends VueMixin[]>(...Ctors: T): MixedVueBase<T>
export function mixins(...Ctors: VueMixin[]): VueConstructor {
  return class MixedVue extends Vue {
    static __b: ComponentOptions = {
      mixins: Ctors.map((Ctor) => Ctor.__vccOpts),
    }

    constructor(...args: any[]) {
      super(...args)

      Ctors.forEach((Ctor) => {
        const data = new (Ctor as VueConstructor)(...args)
        Object.keys(data).forEach((key) => {
          ;(this as any)[key] = (data as any)[key]
        })
      })
    }
  }
}

export type UnwrapSetupValue<T> = T extends Ref<infer R>
  ? R
  : ShallowUnwrapRef<T>

export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T

export function setup<R>(setupFn: () => R): UnwrapSetupValue<UnwrapPromise<R>> {
  // Hack to delay the invocation of setup function.
  // Will be called after dealing with class properties.
  return {
    __s: setupFn,
  } as UnwrapSetupValue<UnwrapPromise<R>>
}
