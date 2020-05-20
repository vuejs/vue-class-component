import {
  reactive,
  ComponentPublicInstance,
  ComponentOptions,
  VNode,
  SetupContext,
} from 'vue'

function defineGetter<T, K extends keyof T>(
  obj: T,
  key: K,
  getter: () => T[K]
): void {
  Object.defineProperty(obj, key, {
    get: getter,
    enumerable: false,
    configurable: true,
  })
}

function defineProxy(proxy: any, key: string, target: any): void {
  Object.defineProperty(proxy, key, {
    get: () => target[key],
    set: (value) => {
      target[key] = value
    },
    enumerable: true,
    configurable: true,
  })
}

function getSuperOptions(Ctor: Function): ComponentOptions | undefined {
  const superProto = Object.getPrototypeOf(Ctor.prototype)
  if (!superProto) {
    return undefined
  }

  const Super = superProto.constructor as typeof Vue
  return Super.__vccOpts
}

export interface VueStatic {
  // -- Class component configs

  /** @internal */
  __vccCache?: ComponentOptions

  /** @internal */
  __vccBase?: ComponentOptions

  /** @internal */
  __vccDecorators?: ((options: ComponentOptions) => void)[]

  /** @internal */
  __vccMixins?: ComponentOptions[]

  /** @internal */
  __vccHooks: string[]

  /** @internal */
  __vccOpts: ComponentOptions

  // --- Vue Loader etc injections

  /** @internal */
  render?: () => VNode | void

  /** @internal */
  ssrRender?: () => void

  /** @internal */
  __file?: string

  /** @internal */
  __cssModules?: Record<string, any>

  /** @internal */
  __scopeId?: string

  /** @internal */
  __hmrId?: string

  // --- Public APIs

  registerHooks(keys: string[]): void
}

export type VueMixin<V extends Vue = Vue> = VueStatic & { prototype: V }

export type VueBase<V extends Vue = Vue> = VueMixin<V> &
  (new (...args: any[]) => V)

export interface ClassComponentHooks {
  // To be extended on user land

  data?(): object
  beforeCreate?(): void
  created?(): void
  beforeMount?(): void
  mounted?(): void
  beforeUnmount?(): void
  unmounted?(): void
  beforeUpdate?(): void
  updated?(): void
  activated?(): void
  deactivated?(): void
  render?(): VNode | void
  errorCaptured?(err: Error, vm: Vue, info: string): boolean | undefined
  serverPrefetch?(): Promise<unknown>
}

export type Vue<Props = unknown> = ComponentPublicInstance<
  {},
  {},
  {},
  {},
  {},
  Record<string, any>,
  Props
> &
  ClassComponentHooks

export interface VueConstructor extends VueStatic {
  new <Props = unknown>(prop: Props, ctx: SetupContext): Vue<Props>
}

class VueImpl {
  /** @internal */
  static __vccCache?: ComponentOptions

  /** @internal */
  static __vccBase?: ComponentOptions

  /** @internal */
  static __vccDecorators?: ((options: ComponentOptions) => void)[]

  /** @internal */
  static __vccMixins?: ComponentOptions[]

  /** @internal */
  static __vccHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUnmount',
    'unmounted',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render',
    'errorCaptured',
    'serverPrefetch',
  ]

  /** @internal */
  static get __vccOpts(): ComponentOptions {
    // Early return if `this` is base class as it does not have any options
    if (this === Vue) {
      return {}
    }

    const cache = this.hasOwnProperty('__vccCache') && this.__vccCache
    if (cache) {
      return cache
    }

    const Ctor = this

    // If the options are provided via decorator use it as a base
    const options = (this.__vccCache = this.hasOwnProperty('__vccBase')
      ? { ...this.__vccBase }
      : {})

    // Handle super class options
    options.extends = getSuperOptions(Ctor)

    // Handle mixins
    const mixins = this.hasOwnProperty('__vccMixins') && this.__vccMixins
    if (mixins) {
      options.mixins = options.mixins ? options.mixins.concat(mixins) : mixins
    }

    options.methods = { ...options.methods }
    options.computed = { ...options.computed }

    const proto = Ctor.prototype
    Object.getOwnPropertyNames(proto).forEach((key) => {
      if (key === 'constructor') {
        return
      }

      // hooks
      if (Ctor.__vccHooks.indexOf(key) > -1) {
        ;(options as any)[key] = (proto as any)[key]
        return
      }

      const descriptor = Object.getOwnPropertyDescriptor(proto, key)!

      // methods
      if (typeof descriptor.value === 'function') {
        ;(options.methods as any)[key] = descriptor.value
        return
      }

      // computed properties
      if (descriptor.get || descriptor.set) {
        ;(options.computed as any)[key] = {
          get: descriptor.get,
          set: descriptor.set,
        }
        return
      }
    })

    options.setup = function (props: Record<string, any>, ctx: SetupContext) {
      const data: any = new Ctor(props, ctx)
      const dataKeys = Object.keys(data)

      const plainData: any = reactive({})

      // Initialize reactive data and convert constructor `this` to a proxy
      dataKeys.forEach((key) => {
        // Skip if the value is undefined not to make it reactive.
        // If the value has `__s`, it's a value from `setup` helper, proceed it later.
        if (data[key] === undefined || (data[key] && data[key].__s)) {
          return
        }

        plainData[key] = data[key]
        defineProxy(data, key, plainData)
      })

      // Invoke composition functions
      dataKeys.forEach((key) => {
        if (data[key] && data[key].__s) {
          plainData[key] = data[key].__s()
        }
      })

      return plainData
    }

    const decorators =
      this.hasOwnProperty('__vccDecorators') && this.__vccDecorators
    if (decorators) {
      decorators.forEach((fn) => fn(options))
    }

    // from Vue Loader
    const injections = [
      'render',
      'ssrRender',
      '__file',
      '__cssModules',
      '__scopeId',
      '__hmrId',
    ]
    injections.forEach((key) => {
      if ((Ctor as any)[key]) {
        options[key] = (Ctor as any)[key]
      }
    })

    return options
  }

  static registerHooks(keys: string[]): void {
    this.__vccHooks.push(...keys)
  }

  $props!: Record<string, any>
  $emit!: (event: string, ...args: any[]) => void
  $attrs!: ComponentPublicInstance['$attrs']
  $slots!: ComponentPublicInstance['$slots']

  constructor(props: Record<string, any>, ctx: SetupContext) {
    defineGetter(this, '$props', () => props)
    defineGetter(this, '$attrs', () => ctx.attrs)
    defineGetter(this, '$slots', () => ctx.slots)
    defineGetter(this, '$emit', () => ctx.emit)

    Object.keys(props).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: (props as any)[key],
      })
    })
  }
}

export const Vue: VueConstructor = VueImpl as VueConstructor
