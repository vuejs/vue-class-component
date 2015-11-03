import VueCompoent from '../'

@VueCompoent
class App {

// template
  static template = `
    <div>
      <input v-model="msg">
      <p>prop: {{propMessage}}</p>
      <p>msg: {{msg}}</p>
      <p>computed msg: {{computedMsg}}</p>
      <button @click="greet">Greet</button>
    </div>
  `

  // props
  static props = {
    propMessage: String
  }

  // return initial data
  data () {
    return {
      msg: 123
    }
  }

  // lifecycle hook
  ready () {
    this.greet()
  }

  // computed
  get computedMsg () {
    return 'computed ' + this.msg
  }

  // method
  greet () {
    alert('greeting: ' + this.msg)
  }
}

// mount
new App({
  el: '#el'
})
