import Vue from 'vue'
import Vuex from 'vuex'

interface CounterState {
  count: number
}

Vue.use(Vuex)

const state = {
  count: 0
}

const mutations = {
  increment (state: CounterState) {
    state.count++
  }
}

export default new Vuex.Store({
  state,
  mutations
})
