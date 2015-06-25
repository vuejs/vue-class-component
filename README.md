# vue-class-component

> Experimental ES7 / TypeScript decorator for class-style Vue components.

### Example Usage with Babel stage=0:

``` js
import component from 'vue-class-component'

@component
export default class Component {

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

Theoretically, this should also work properly as a TypeScript 1.5+ decorator, but I'm not familiar enough with TypeScript to figure out how type checks would come into play. If you'd like to make it work properly with TypeScript, feel free to contribute!
