/**
 * Managing `meta data` of each component that includes
 * internalHooks and decoratorQueue. Since the property
 * decorators are called before creating component constructor,
 * we need to store decorator hooks globaly and call it
 * in component's class decorator later.
 */

import * as Vue from 'vue'
import { Dictionary, VueInternal } from './declarations'

export type DecoratorHook = (options: Vue.ComponentOptions<Vue>, value?: any) => void

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
   * will register functions that update component options for lazy processing.
   * They will be executed just before creating component constructor.
   */
  decoratorMap: Dictionary<DecoratorHook> = {}

  /**
   * Property names that indicates the initial property will be
   * processed on user-defined decorators. Also they will not collected in `data` hook.
   */
  propertyNameMap: Dictionary<boolean> = {}

  get shouldGetInitalProperty () {
    return Object.keys(this.propertyNameMap).length > 0
  }
}

export interface CreateDecoratorOptions {
  getInitialProperty?: boolean
}

// Property or method decorators
export function createDecorator (
  factory: (options: Vue.ComponentOptions<Vue>, key: string, value: any) => void,
  options?: CreateDecoratorOptions
): (target: Vue, key: string) => void

// Parameter decorators
export function createDecorator (
  factory: (options: Vue.ComponentOptions<Vue>, key: string, index: number) => void,
  options?: CreateDecoratorOptions
): (target: Vue, key: string, index: number) => void

export function createDecorator (
  factory: (options: Vue.ComponentOptions<Vue>, key: string, index: number) => void,
  options: CreateDecoratorOptions = {}
): (target: VueInternal, key: string, index: any) => void {

  return (proto, key, index) => {

    let meta = proto.__vue_component_meta__
    if (!meta) {
      proto.__vue_component_meta__ = meta = new Meta()
    }

    // Allow to process an initial property on userland
    if (options.getInitialProperty) {
      meta.propertyNameMap[key] = true
    }

    meta.decoratorMap[key] = (options, value) => {
      if (typeof index === 'number') {
        // If `index` is number, it is a parameter decorator
        factory(options, key, index)
      } else {
        // Otherwise, it is a property or method decorator
        // It can be recieved an initial property value
        // if `initialProperty` option is true
        factory(options, key, value)
      }
    }
  }
}
