import { Dictionary } from './declarations'

export const noop = () => {}

export function warn (message: string): void {
  if (typeof console !== 'undefined') {
    console.warn('[vue-class-component] ' + message)
  }
}

export function forEachValues <T> (
  obj: Dictionary<T>,
  fn: (value: T, key: string) => void
): void {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}