import Vue from 'vue'
import Vuex, { ActionContext } from "vuex"
interface CounterState{
  count: number
}

Vue.use(Vuex)

const state = {
  count: 0
}

const mutations = {
  increment (state: CounterState) {
    state.count++
  },
  decrement (state: CounterState) {
    state.count--
  }
}

const actions = {
  increment: (context: ActionContext<CounterState, any>) => context.commit('increment'),
  decrement: (context: ActionContext<CounterState, any>) => context.commit('decrement'),
  incrementIfOdd (context: ActionContext<CounterState, any>) {
    if ((context.state.count + 1) % 2 === 0) {
      context.commit('increment')
    }
  },
  incrementAsync (context: ActionContext<CounterState, any>) {
    return new Promise((resolve) => {
      setTimeout(() => {
        context.commit('increment')
        resolve()
      }, 1000)
    })
  }
}

const getters = {
  evenOrOdd: (state: CounterState) => state.count % 2 === 0 ? 'even' : 'odd'
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})