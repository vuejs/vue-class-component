import { ComponentOptions, SetupContext, UnwrapRef } from 'vue'
import { Vue, VueBase, VueMixin } from './vue'

export function Options <V extends Vue> (options: ComponentOptions & ThisType<V>): <VC extends VueBase>(target: VC) => VC {
  return Component => {
    Component.__vccBase = options
    return Component
  }
}

export interface VueDecorator {
  // Class decorator
  (Ctor: VueBase): void

  // Property decorator
  (target: Vue, key: string): void

  // Parameter decorator
  (target: Vue, key: string, index: number): void
}

export function createDecorator (factory: (options: ComponentOptions, key: string, index: number) => void): VueDecorator {
  return (target: Vue | VueBase, key?: any, index?: any) => {
    const Ctor = typeof target === 'function'
      ? target
      : target.constructor as VueBase
    if (!Ctor.__vccDecorators) {
      Ctor.__vccDecorators = []
    }
    if (typeof index !== 'number') {
      index = undefined
    }
    Ctor.__vccDecorators.push(options => factory(options, key, index))
  }
}

interface PropsMixin {
  new <Props = unknown>(...args: any[]): {
    $props: Props
  }
}

type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never

type ExtractInstance<T> = T extends VueMixin<infer V>
  ? V
  : never

type MixedVueBase<Mixins extends VueMixin[]> = Mixins extends (infer T)[]
  ? VueBase<UnionToIntersection<ExtractInstance<T>> & Vue> & PropsMixin
  : never

export function mixins <T extends VueMixin[]> (...Ctors: T): MixedVueBase<T>
export function mixins (...Ctors: VueMixin[]): VueBase {
  return class MixedVue<Props> extends Vue<Props> {
    static __vccMixins = Ctors.map(Ctor => Ctor.__vccOpts)

    constructor (props: Props, ctx: SetupContext) {
      super(props, ctx)

      Ctors.forEach(Ctor => {
        const data = new (Ctor as any)(props, ctx)
        Object.keys(data).forEach(key => {
          (this as any)[key] = data[key]
        })
      })
    }
  }
}

export function setup <R> (setupFn: () => R): UnwrapRef<R> {
  // Hack to delay the invocation of setup function.
  // Will be called after dealing with class properties.
  return {
    __s: setupFn
  } as UnwrapRef<R>
}
