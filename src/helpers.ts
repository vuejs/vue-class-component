import {
  ComponentOptions,
  UnwrapRef,
  ComponentObjectPropsOptions,
  ExtractPropTypes,
  ExtractDefaultPropTypes,
} from 'vue'

import {
  ClassComponentHooks,
  EmitsOptions,
  ObjectEmitsOptions,
  Vue,
  VueBase,
  VueConstructor,
  VueMixin,
} from './vue'

export function Options<V extends Vue>(
  options: ComponentOptions & ThisType<V>
): <VC extends VueConstructor>(target: VC) => VC {
  return (Component) => {
    Component.__vccBase = options
    return Component
  }
}

export interface VueDecorator {
  // Class decorator
  (Ctor: VueConstructor): void

  // Property decorator
  (target: Vue, key: string): void

  // Parameter decorator
  (target: Vue, key: string, index: number): void
}

export function createDecorator(
  factory: (options: ComponentOptions, key: string, index: number) => void
): VueDecorator {
  return (target: Vue | VueConstructor, key?: any, index?: any) => {
    const Ctor =
      typeof target === 'function'
        ? target
        : (target.constructor as VueConstructor)
    if (!Ctor.__vccDecorators) {
      Ctor.__vccDecorators = []
    }
    if (typeof index !== 'number') {
      index = undefined
    }
    Ctor.__vccDecorators.push((options) => factory(options, key, index))
  }
}

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export type ExtractInstance<T> = T extends VueMixin<infer V> ? V : never

export type NarrowEmit<T extends VueBase> = Omit<
  T,
  '$emit' | keyof ClassComponentHooks
> &
  // Reassign class component hooks as mapped types makes prototype function (`mounted(): void`) instance function (`mounted: () => void`).
  ClassComponentHooks & {
    // Exclude generic $emit type (`$emit: (event: string, ...args: any[]) => void`) if there are another intersected type.
    $emit: T['$emit'] extends ((event: string, ...args: any[]) => void) &
      infer R
      ? unknown extends R
        ? T['$emit']
        : R
      : T['$emit']
  }

export type MixedVueBase<Mixins extends VueMixin[]> = Mixins extends (infer T)[]
  ? VueConstructor<
      NarrowEmit<UnionToIntersection<ExtractInstance<T>> & Vue> & VueBase
    >
  : never

export function mixins<T extends VueMixin[]>(...Ctors: T): MixedVueBase<T>
export function mixins(...Ctors: VueMixin[]): VueConstructor {
  return class MixedVue extends Vue {
    static __vccExtend(options: ComponentOptions) {
      Ctors.forEach((Ctor) => Ctor.__vccExtend(options))
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

export function props<
  PropNames extends string,
  Props = Readonly<{ [key in PropNames]?: any }>
>(propNames: PropNames[]): VueConstructor<Vue<Props> & Props>

export function props<
  PropsOptions extends ComponentObjectPropsOptions,
  Props = Readonly<ExtractPropTypes<PropsOptions>>,
  DefaultProps = ExtractDefaultPropTypes<PropsOptions>
>(
  propsOptions: PropsOptions
): VueConstructor<Vue<Props, {}, DefaultProps> & Props>

export function props(
  propsOptions: string[] | ComponentObjectPropsOptions
): VueConstructor {
  class PropsMixin extends Vue {
    static __vccExtend(options: ComponentOptions) {
      options.props = propsOptions
    }
  }
  return PropsMixin
}

export function emits<EmitNames extends string>(
  emitNames: EmitNames[]
): VueConstructor<Vue<unknown, EmitNames[]>>

export function emits<EmitsOptions extends ObjectEmitsOptions>(
  emitsOptions: EmitsOptions
): VueConstructor<Vue<unknown, EmitsOptions>>

export function emits(emitsOptions: EmitsOptions): VueConstructor {
  class EmitsMixin extends Vue {
    static __vccExtend(options: ComponentOptions) {
      options.emits = emitsOptions
    }
  }
  return EmitsMixin
}

export function setup<R>(setupFn: () => R): UnwrapRef<R> {
  // Hack to delay the invocation of setup function.
  // Will be called after dealing with class properties.
  return {
    __s: setupFn,
  } as UnwrapRef<R>
}
