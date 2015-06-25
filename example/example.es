import Vue from 'vue'
import VueClassy from '../'

Vue.use(VueClassy)

@Vue.componentClass
export default class Component extends Vue {

  // template
  static template = `
    <div>
      <input v-model="msg">
      <p>msg: {{msg}}</p>
      <p>computed msg: {{computedMsg}}</p>
      <button v-on="click:greet">Greet</button>
    </div>
  `

  // data
  msg = 'hello'

  // computed
  get computedMsg() {
    return 'computed ' + this.msg
  }

  // method
  greet() {
    alert('greeting: ' + this.msg)
  }

  // lifecycle hook
  ready() {
    this.greet()
  }
}

// mount
new Component({
  el: '#el'
})
