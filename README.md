# vue-class-component

> ECMAScript / TypeScript decorator for class-style Vue components.

### Usage

**Required**: [ECMAScript stage 1 decorators](https://github.com/wycats/javascript-decorators/blob/master/README.md).
If you use Babel, [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) is needed.
If you use TypeScript, enable `--experimentalDecorators` flag.

Note:

1. `methods` can be declared directly as class member methods.

2. Computed properties can be declared as class property accessors.

3. Initial `data` can be declared as class properties ([babel-plugin-transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) is required if you use Babel).

4. `data`, `render` and all Vue lifecycle hooks can be directly declared as class member methods as well, but you cannot invoke them on the instance itself. When declaring custom methods, you should avoid these reserved names.

5. For all other options, pass them to the decorator function.

### Example

Following is the example written in Babel. If you are looking for TypeScript version, [it's in the example directory](example/App.vue).

``` vue
<template>
  <div>
    <input v-model="msg">
    <p>prop: {{propMessage}}</p>
    <p>msg: {{msg}}</p>
    <p>helloMsg: {{helloMsg}}</p>
    <p>computed msg: {{computedMsg}}</p>
    <button @click="greet">Greet</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    propMessage: String
  }
})
export default class App extends Vue {
  // initial data
  msg = 123

  // use prop values for initial data
  helloMsg = 'Hello, ' + this.propMessage

  // lifecycle hook
  mounted () {
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
</script>
```

You may also want to check out the `@prop` and `@watch` decorators provided by [vue-property-decorators](https://github.com/kaorun343/vue-property-decorator).

### Create Custom Decorators

You can extend the functionality of this library by creating your own decorators. vue-class-component provides `createDecorator` helper to create custom decorators. `createDecorator` expects a callback function as the 1st argument and the callback will receive following arguments:

- `options`: Vue component options object. Changes for this object will affect the provided component.
- `key`: The property or method key that the decorator is applied.
- `parameterIndex`: The index of a decorated argument if the custom decorator is used for an argument.

Example of creating `NoCache` decorator:

``` js
// decorators.js
import { createDecorator } from 'vue-class-component'

export const NoCache = createDecorator((options, key) => {
  // component options should be passed to the callback
  // and update for the options object affect the component
  options.computed[key].cache = false
})
```

``` js
import { NoCache } from './decorators'

@Component
class MyComp extends Vue {
  // the computed property will not be cached
  @NoCache
  get random () {
    return Math.random()
  }
}
```

### Adding Custom Hooks

If you use some Vue plugins like Vue Router, you may want class components to resolve hooks that they provides. For that case, `Component.registerHooks` allows you to register such hooks:

```js
// class-component-hooks.js
import Component from 'vue-class-component'

// Register the router hooks with thier names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave'
])
```

```js
// MyComp.js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
class MyComp extends Vue {
  // The class component now treats beforeRouteEnter
  // and beforeRouteLeave as Vue Router hooks
  beforeRouteEnter () {
    console.log('beforeRouteEnter')
  }

  beforeRouteLeave () {
    console.log('beforeRouteLeave')
  }
}
```

Note that you have to register the hooks before component definition.

```js
// main.js

// Make sure to register before importing any components
import './class-component-hooks'

import Vue from 'vue'
import MyComp from './MyComp'

new Vue({
  el: '#app',
  components: {
    MyComp
  }
})
```

### Build the Example

``` bash
$ npm install && npm run example
```

### License

[MIT](http://opensource.org/licenses/MIT)
