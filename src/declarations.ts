import * as Vue from 'vue'

export type VueClass = { new (): Vue } & typeof Vue
