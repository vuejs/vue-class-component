# vue-class-component

> ECMAScript / TypeScript decorator for class-style Vue components.

[![npm](https://img.shields.io/npm/v/vue-class-component.svg)](https://www.npmjs.com/package/vue-class-component)

### Usage

**Required**: [ECMAScript stage 1 decorators](https://github.com/wycats/javascript-decorators/blob/master/README.md).
If you use Babel, [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) is needed.
If you use TypeScript, enable `--experimentalDecorators` flag.

> It does not support the stage 2 decorators yet since mainstream transpilers still transpile to the old decorators.

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

### Using Mixins

vue-class-component provides `mixins` helper function to use [mixins](https://vuejs.org/v2/guide/mixins.html) in class style manner. By using `mixins` helper, TypeScript can infer mixin types and inherit them on the component type.

Example of declaring a mixin:

``` js
// mixin.js
import Vue from 'vue'
import Component from 'vue-class-component'

// You can declare a mixin as the same style as components.
@Component
export class MyMixin extends Vue {
  mixinValue = 'Hello'
}
```

Example of using a mixin:

``` js
import Component, { mixins } from 'vue-class-component'
import MyMixin from './mixin.js'

// Use `mixins` helper function instead of `Vue`.
// `mixins` can receive any number of arguments.
@Component
export class MyComp extends mixins(MyMixin) {
  created () {
    console.log(this.mixinValue) // -> Hello
  }
}
```

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

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
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

### Caveats of Class Properties

vue-class-component collects class properties as Vue instance data by instantiating the original constructor under the hood. While we can define instance data like native class manner, we sometimes need to know how it works.

#### `this` value in property

If you define an arrow function as a class property and access `this` in it, it will not work. This is because `this` is just a proxy object to Vue instance when initializing class properties:

```js
@Component
class MyComp extends Vue {
  foo = 123

  bar = () => {
    // Does not update the expected property.
    // `this` value is not a Vue instance in fact.
    this.foo = 456
  }
}
```

You can simply define a method instead of a class property in that case because Vue will bind the instance automatically:

```js
@Component
class MyComp extends Vue {
  foo = 123

  bar () {
    // Correctly update the expected property.
    this.foo = 456
  }
}
```

#### `undefined` will not be reactive

To take consistency between the decorator behavior of Babel and TypeScript, vue-class-component does not make a property reactive if it has `undefined` as initial value. You should use `null` as initial value or use `data` hook to initialize `undefined` property instead.

```js
@Component
class MyComp extends Vue {
  // Will not be reactive
  foo = undefined

  // Will be reactive
  bar = null

  data () {
    return {
      // Will be reactive
      baz: undefined
    }
  }
}
```

### Build the Example

``` bash
$ npm install && npm run example
```

### Questions

For questions and support please use the [the official forum](http://forum.vuejs.org) or [community chat](https://chat.vuejs.org/). The issue list of this repo is **exclusively** for bug reports and feature requests.

### License

[MIT](http://opensource.org/licenses/MIT)
