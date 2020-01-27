# Extend and Mixins

## Extend

You can extend an existing class compnent as native class inheritance. Imagine you have following super class component:

```js
// super.js
import Vue from 'vue'
import Component from 'vue-class-component'

// Define a super class component
@Component
export default class Super extends Vue {
  superValue = 'Hello'
}
```

You can extend it by using native class inheritance syntax:

```js
import Super from './super'
import Component from 'vue-class-component'

// Extending the Super class component
@Component
export default class HelloWorld extends Super {
  created() {
    console.log(this.superValue) // -> Hello
  }
}
```

Note that every super class must be a class component. In other words, it needs to inherit `Vue` constructor as an ancestor and be decorated by `@Component` decorator.

## Mixins

Vue Class Component provides `mixins` helper function to use [mixins](https://vuejs.org/v2/guide/mixins.html) in class style manner. By using `mixins` helper, TypeScript can infer mixin types and inherit them on the component type.

Example of declaring mixins `Hello` and `World`:

```js
// mixins.js
import Vue from 'vue'
import Component from 'vue-class-component'

// You can declare mixins as the same style as components.
@Component
export class Hello extends Vue {
  hello = 'Hello'
}

@Component
export class World extends Vue {
  world = 'World'
}
```

Use them in a class style component:

```js
import Component, { mixins } from 'vue-class-component'
import { Hello, World } from './mixins'

// Use `mixins` helper function instead of `Vue`.
// `mixins` can receive any number of arguments.
@Component
export class HelloWorld extends mixins(Hello, World) {
  created () {
    console.log(this.hello + ' ' + this.world + '!') // -> Hello World!
  }
}
```

As same as super class, all mixins must be declared as class components.
