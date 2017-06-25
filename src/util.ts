import Vue, { ComponentOptions } from 'vue'
import { DecoratedClass } from './declarations'

export const noop = () => {}

export function createDecorator (
  factory: (options: ComponentOptions<Vue>, key: string) => void
): (target: Vue, key: string) => void
export function createDecorator (
  factory: (options: ComponentOptions<Vue>, key: string, index: number) => void
): (target: Vue, key: string, index: number) => void
export function createDecorator (
  factory: (options: ComponentOptions<Vue>, key: string, index: number) => void
): (target: Vue, key: string, index: any) => void {
  return (target, key, index) => {
    const Ctor = target.constructor as DecoratedClass
    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = []
    }
    if (typeof index !== 'number') {
      index = undefined
    }
    Ctor.__decorators__.push(options => factory(options, key, index))
  }
}

export function warn (message: string): void {
  if (typeof console !== 'undefined') {
    console.warn('[vue-class-component] ' + message)
  }
}
