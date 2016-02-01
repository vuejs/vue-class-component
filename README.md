# vue-class-component

> ECMAScript / TypeScript decorator for class-style Vue components.

### Usage

**Required**: Babel with stage 1 transforms, or TypeScript 1.5+ (for [decorators](https://github.com/wycats/javascript-decorators/blob/master/README.md)).

Note:

1. `methods` can be declared directly as class member methods.

2. Computed properties can be declared as class property accessors.

3. `data`, `el` and all Vue lifecycle hooks can be directly declared as class member methods as well, but you cannot invoke them on the instance itself. When declaring custom methods, you should avoid these reserved names.

4. For all other options, pass them to the decorator function.

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
