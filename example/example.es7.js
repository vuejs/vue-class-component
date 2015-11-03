import component from '../'

@component
export default class Component {

  // template
  static template = `
    <div>
      <input v-model="msg">
      <p>msg: {{msg}}</p>
      <p>computed msg: {{computedMsg}}</p>
      <button @click="greet">Greet</button>
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
