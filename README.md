# vue-classy

> Experimental ES7 / TypeScript decorator for class-style Vue components.

### Example Usage with Babel stage=0:

``` js
import Vue from 'vue'
import VueClassy from 'vue-classy'

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
```

### Build the Example

``` bash
$ npm install && npm run build
```

Theoretically, this should also work properly as a TypeScript 1.5+ decorator. If you'd like to make it work properly with TypeScript, feel free to contribute!
