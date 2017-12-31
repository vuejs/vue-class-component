import Vue, { PropOptions, WatchOptions } from 'vue'
import { createDecorator, VueDecorator } from './util'

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return VueDecorator
 */
export function Watch(path: string, options: WatchOptions = {}) {
    const { deep = false, immediate = false } = options

    return createDecorator((componentOptions, handler) => {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null)
        }
        (componentOptions.watch as any)[path] = { handler, deep, immediate }
    })
}
