import Vue = require('vue')
import App from './App.vue'

// mount
new Vue({
  el: '#app',
  render: h => h(App, {
    props: { propMessage: 'World' }
  })
})
