import { Prop, PropType } from 'vue'
import { Vue } from './vue'

declare const withDefaultSymbol: unique symbol

export interface WithDefault<T> {
  [withDefaultSymbol]: T
}

export type DefaultFactory<T> = (
  props: Record<string, unknown>
) => T | null | undefined

export interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null
  required?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object
  validator?(value: unknown): boolean
}

export interface PropOptionsWithDefault<T, D = T> extends PropOptions<T, D> {
  default: PropOptions<T, D>['default']
}

export interface PropOptionsWithRequired<T, D = T> extends PropOptions<T, D> {
  required: true
}

export type VueWithProps<P> = Vue<ExtractProps<P>, {}, ExtractDefaultProps<P>> &
  ExtractProps<P>

export type ExtractProps<P> = {
  [K in keyof P]: P[K] extends WithDefault<infer T> ? T : P[K]
}

export type DefaultKeys<P> = {
  [K in keyof P]: P[K] extends WithDefault<any> ? K : never
}[keyof P]

export type ExtractDefaultProps<P> = {
  [K in DefaultKeys<P>]: P[K] extends WithDefault<infer T> ? T : never
}

// With default
export function prop<T>(options: PropOptionsWithDefault<T>): WithDefault<T>

// With required
export function prop<T>(options: PropOptionsWithRequired<T>): T

// Others
export function prop<T>(options: Prop<T>): T

// Actual implementation
export function prop(options: Prop<unknown>): unknown {
  return options
}
