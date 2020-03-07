# Overview

Vue Class Component is a library that lets you make your Vue components in class-style syntax. For example, below is a simple counter component written with Vue Class Component:

```vue
<template>
  <div>
    <button v-on:click="decrement">-</button>
    {{ count }}
    <button v-on:click="increment">+</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

// Define the component in class-style
@Component
export default class Counter extends Vue {
  // Class properties will be component data
  count = 0

  // Methods will be component methods
  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}
</script>
```

As the example shows, you can define component data and methods in the intuitive and standard class syntax by annotating the class with the `@Component` decorator. You can simply replace your component definition with a class-style component as it is equivalent with the ordinary options object style of component definition.

By defining your component in class-style, you not only change the syntax but also can utilize some ECMAScript language features such as class inheritance and decorators. Vue Class Component also provides a [`mixins` helper](guide/extend-and-mixins.md#Mixins) for mixin inheritance, and a [`createDecorator` function](guide/custom-decorators.md) to create your own decrators easily.

You may also want to check out the `@Prop` and `@Watch` decorators provided by [Vue Property Decorator](https://github.com/kaorun343/vue-property-decorator).
