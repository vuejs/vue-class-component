# vue-class-component

> Experimental ES2016/TypeScript decorator for class-style Vue components.

### Example Usage with Babel stage=0:

Note:

1. `data`, `el` and all Vue lifecycle hooks can be directly declared as class member methods, but you cannot invoke them on the instance itself. When declaring custom methods, you should avoid these reserved names.

2. For all other options, declare them as **static properties**.

``` js
import VueComponent from 'vue-class-component'

@VueComponent
export default class Component {

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
```

### Build the Example

``` bash
$ npm install && npm run build
```

Theoretically, this should also work properly as a TypeScript 1.5+ decorator, but I'm not familiar enough with TypeScript to figure out how type checks would come into play. If you'd like to make it work properly with TypeScript, feel free to contribute!
