/**
 * Managing `meta data` of each component that includes
 * internalHooks and decoratorQueue. Since the property
 * decorators are called before creating component constructor,
 * we need to store decorator hooks globaly and call it
 * in component's class decorator later.
 */

import * as Vue from 'vue'
import { VueInternal } from './declarations'

export class Meta {
  /**
   * The method names that the component decorator will
   * just register on component options object.
   * We can extend this list by using `Component.registerHooks`.
   */
  static internalHooks = [
    'data', 'beforeCreate', 'created', 'beforeMount', 'mounted',
    'beforeDestroy', 'destroyed', 'beforeUpdate', 'updated',
    'activated', 'deactivated', 'render'
  ]

  /**
   * Property, method and parameter decorators created by `createDecorator` helper
   * will enqueue functions that update component options for lazy processing.
   * They will be executed just before creating component constructor.
   */
  decoratorQueue: ((options: Vue.ComponentOptions<Vue>) => void)[] = []
}


export interface CreateDecoratorOptions {
  hookPropertyInitializer?: (options: Vue.ComponentOptions<Vue>, value: any) => void
}

export function createDecorator (
  factory: (options: Vue.ComponentOptions<Vue>, key: string) => void
): (target: Vue, key: string) => void
export function createDecorator (
  factory: (options: Vue.ComponentOptions<Vue>, key: string, index: number) => void
): (target: Vue, key: string, index: number) => void
export function createDecorator (
  factory: (options: Vue.ComponentOptions<Vue>, key: string, index: number) => void
): (target: VueInternal, key: string, index: any) => void {
  return (proto, key, index) => {
    let meta = proto.__vue_component_meta__
    if (!meta) {
      proto.__vue_component_meta__ = meta = new Meta()
    }

    // Do not expose property descriptor
    if (typeof index !== 'number') {
      index = undefined
    }

    meta.decoratorQueue.push(options => factory(options, key, index))
  }
}
