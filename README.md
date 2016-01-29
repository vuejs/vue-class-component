# vue-class-component

> Experimental ES2016/TypeScript decorator for class-style Vue components.

### Usage

Required: Babel with stage 1 transforms (for [decorators](https://github.com/wycats/javascript-decorators/blob/master/README.md)).

Note:

1. `data`, `el` and all Vue lifecycle hooks can be directly declared as class member methods, but you cannot invoke them on the instance itself. When declaring custom methods, you should avoid these reserved names.

2. For all other options, pass them to the decorator function.

``` js
import Component from 'vue-class-component'

@Component({
  props: {
    propMessage: String
  },
  template: `
    <div>
      <input v-model="msg">
      <p>prop: {{propMessage}}</p>
      <p>msg: {{msg}}</p>
      <p>computed msg: {{computedMsg}}</p>
      <button @click="greet">Greet</button>
    </div>
  `
})
class App {
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
