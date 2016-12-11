import * as Vue from 'vue'
import { $decoratorQueue } from './component'

export const noop = () => {}

export function createDecorator (
  factory: (options: Vue.ComponentOptions<Vue>, key: string) => void
): (target: Vue, key: string) => void
export function createDecorator (
  factory: (options: Vue.ComponentOptions<Vue>, key: string, index: number) => void
): (target: Vue, key: string, index: number) => void
export function createDecorator (
  factory: (options: Vue.ComponentOptions<Vue>, key: string, index: number) => void
): (target: Vue, key: string, index: any) => void {
  return (_, key, index) => {
    if (typeof index !== 'number') {
      index = undefined
    }
    $decoratorQueue.push(options => factory(options, key, index))
  }
}

export function warn (message: string): void {
  if (typeof console !== 'undefined') {
    console.warn('[vue-class-component] ' + message)
  }
}
