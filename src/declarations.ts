import * as Vue from 'vue'
import { Meta } from './meta'

export type Dictionary<T> = { [key: string]: T }

export type VueClass = { new (): Vue } & typeof Vue

export type VueInternal = Vue & { __vue_component_meta__?: Meta }