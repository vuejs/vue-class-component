import Vue from 'vue'
import App from './App.vue'
import store from './store'

// mount
new Vue({
  el: '#app',
  store,
  render: h => h(App, {
    props: { propMessage: 'World' }
  })
})
